#!/usr/bin/env bash
# Invoked by scripts/deploy-online.ps1, never by downloading a shell installer.
set -Eeuo pipefail
umask 077

die() { printf 'ERROR: %s\n' "$*" >&2; exit 1; }
[[ ( $# == 7 || $# == 8 ) && $EUID == 0 ]] || die 'Expected seven deployment arguments, an optional recovery flag, and root privileges.'
archive=$1 checksum=$2 base=$3 release_id=$4 origin=$5 port=$6 build=$7
stop_active_games=${8:-0}
[[ $stop_active_games == 0 || $stop_active_games == 1 ]] || die 'Invalid recovery flag.'
printf 'Remote deployment option: StopActiveGames=%s\n' "$stop_active_games"
[[ $base =~ ^/opt/[a-zA-Z0-9_-]+$ && $release_id =~ ^[0-9]{8}T[0-9]{6}Z-[a-f0-9]{8}$ ]] || die 'Invalid deployment path.'
[[ $archive == "/tmp/noname-online-upload-$release_id/release.tar.gz" && $checksum =~ ^[a-f0-9]{64}$ ]] || die 'Invalid upload.'
[[ $origin =~ ^http://[a-zA-Z0-9][a-zA-Z0-9.-]*(:[0-9]+)?$ && $port =~ ^[0-9]+$ && $build =~ ^online-[a-f0-9]{20}$ ]] || die 'Invalid HTTP configuration.'
(( port >= 1 && port <= 65535 )) || die 'Invalid HTTP port.'
[[ -f /etc/os-release ]] || die 'The target must be a Linux server.'
. /etc/os-release
printf 'Remote OS: %s; architecture: %s\n' "${PRETTY_NAME:-$ID}" "$(uname -m)"
case $(uname -m) in x86_64|aarch64) ;; *) die 'This deployment requires x86_64 or aarch64.' ;; esac
command -v systemctl >/dev/null || die 'A systemd Linux server is required for automatic startup.'

# Avoid overriding Docker endpoints or Compose interpolation with login-shell
# variables. The project has a dedicated, private environment file.
unset DOCKER_HOST DOCKER_CONTEXT COMPOSE_FILE COMPOSE_PROJECT_NAME COMPOSE_PROFILES
unset POSTGRES_PASSWORD ADMIN_STATUS_TOKEN PUBLIC_ORIGIN PUBLIC_PORT ONLINE_BUILD_ID
unset MATCH_REGION RESUME_GRACE_MS ONLINE_MAINTENANCE MAX_GAME_INSTANCES MAX_ROOMS PLATFORM_MEMORY PLATFORM_CPUS CHROMIUM_SANDBOX ALLOW_MULTI_OPEN

install_packages() {
  if command -v apt-get >/dev/null; then
    DEBIAN_FRONTEND=noninteractive apt-get update
    DEBIAN_FRONTEND=noninteractive apt-get install -y "$@"
  elif command -v dnf >/dev/null; then dnf install -y "$@"
  elif command -v yum >/dev/null; then yum install -y "$@"
  else die 'No supported package manager found.'; fi
}

if ! command -v curl >/dev/null || ! command -v flock >/dev/null; then
  install_packages ca-certificates curl util-linux
fi

# Serialize even deployments targeting a different directory: the Compose
# project and its persistent database volume must have a single owner.
exec 9>/run/lock/noname-online-deploy.lock
flock -n 9 || die 'Another online deployment is running. Retry after it finishes.'

# The target already has Docker 26.1.4. Never reinstall/upgrade the engine or
# change its daemon configuration. Add only missing CLI plugins, using fixed
# releases from Docker's repositories and verifying their published checksums.
command -v docker >/dev/null || die 'Docker was expected to be installed; it is not in the remote PATH.'
install_plugin() {
  local plugin=$1 version=$2 filename=$3 checksum_file=$4
  local download="https://github.com/docker/$plugin/releases/download/$version"
  local temp_dir expected
  temp_dir=$(mktemp -d /tmp/noname-docker-plugin.XXXXXXXX)
  curl -fSL --connect-timeout 20 --max-time 600 --retry 3 "$download/$filename" -o "$temp_dir/$filename"
  curl -fSL --connect-timeout 20 --max-time 120 --retry 3 "$download/$checksum_file" -o "$temp_dir/checksums.txt"
  expected=$(awk -v file="$filename" '$2 == file || $2 == "*" file { print $1 }' "$temp_dir/checksums.txt")
  [[ $expected =~ ^[a-f0-9]{64}$ ]] || die "Missing checksum for $plugin."
  printf '%s  %s\n' "$expected" "$temp_dir/$filename" | sha256sum -c -
  install -d -m 755 /usr/local/lib/docker/cli-plugins
  [[ ! -e /usr/local/lib/docker/cli-plugins/docker-$plugin ]] || die "An existing $plugin plugin is broken; repair it before deploying."
  install -m 755 "$temp_dir/$filename" "/usr/local/lib/docker/cli-plugins/docker-$plugin"
  rm -f "$temp_dir/$filename" "$temp_dir/checksums.txt"
  rmdir "$temp_dir"
}
if ! docker compose version >/dev/null 2>&1; then
  compose_file="docker-compose-linux-$(uname -m)"
  install_plugin compose v2.29.7 "$compose_file" "$compose_file.sha256"
fi
systemctl enable --now docker
docker info >/dev/null
# Fail before downloads/builds on a busy small server. Never consume swap as
# a substitute for working RAM, and never alter another application's service.
available_kib=$(awk '/^MemAvailable:/ {print $2}' /proc/meminfo)
disk_kib=$(df -Pk / | awk 'NR==2 {print $4}')
[[ $available_kib =~ ^[0-9]+$ && $disk_kib =~ ^[0-9]+$ ]] || die 'Cannot determine available RAM/disk.'
(( available_kib >= 700 * 1024 )) || die 'Less than 700 MiB RAM available. Free memory before deploying; existing services are kept running.'
(( disk_kib >= 6 * 1024 * 1024 )) || die 'Less than 6 GiB disk space available. Archive old releases/images before retrying.'
docker compose up --help | grep -- '--wait-timeout' >/dev/null || die 'Docker Compose is too old; upgrade the Compose plugin.'
printf '%s  %s\n' "$checksum" "$archive" | sha256sum -c -

# Never adopt an unrelated checkout, deployment or database with new secrets.
if [[ ! -f "$base/.managed-by-noname-deploy" ]]; then
  [[ ! -e $base ]] || die "$base already exists and is not managed by this script. Preserve/migrate the previous deployment first."
  [[ -z $(docker ps -aq --filter label=com.docker.compose.project=noname-online) ]] || die 'An existing noname-online Compose project must be migrated before using this script.'
  if docker volume inspect noname-online_postgres-data >/dev/null 2>&1; then
    die 'An existing online database volume was found without its deployment configuration. Restore that configuration first.'
  fi
  mkdir -p "$base"
  printf 'noname-online-v1\n' > "$base/.managed-by-noname-deploy"
fi
[[ ! -L $base && $(cat "$base/.managed-by-noname-deploy") == noname-online-v1 ]] || die 'Invalid deployment ownership marker.'
for container in $(docker ps -aq --filter label=com.docker.compose.project=noname-online); do
  working_dir=$(docker inspect --format '{{index .Config.Labels "com.docker.compose.project.working_dir"}}' "$container")
  [[ $working_dir == "$base/releases/"*"/deploy/online" ]] || die 'An unrelated container uses the noname-online project name; refusing to replace it.'
done
mkdir -p "$base/releases" "$base/shared/runtime" "$base/backups"
chmod 755 "$base/shared/runtime"
release="$base/releases/$release_id"
[[ ! -e $release ]] || die 'This release directory already exists.'
mkdir "$release"
tar -xzf "$archive" --no-same-owner -C "$release"
[[ -f "$release/dist-online-host/index.html" && -f "$release/deploy/online/compose.yaml" ]] || die 'Incomplete deployment archive.'
chmod -R a+rX "$release/dist-online-host"
chmod 644 "$release/deploy/online/Caddyfile" "$release/deploy/online/Assets.Caddyfile" "$release/deploy/online/seccomp_profile.json"
sed -i 's/\r$//' "$release/deploy/online/"*.sh
chmod 755 "$release/deploy/online/"*.sh
ln -s "$base/shared/runtime" "$release/deploy/online/runtime"

shared_env="$base/shared/.env"
if [[ ! -f $shared_env ]]; then
  if docker volume inspect noname-online_postgres-data >/dev/null 2>&1; then die 'Database exists but shared/.env is missing. Restore it; do not generate a new password.'; fi
  password=$(od -An -N32 -tx1 /dev/urandom | tr -d ' \n')
  token=$(od -An -N32 -tx1 /dev/urandom | tr -d ' \n')
  cat > "$shared_env" <<EOF
POSTGRES_PASSWORD=$password
ADMIN_STATUS_TOKEN=$token
MATCH_REGION=default
RESUME_GRACE_MS=120000
ONLINE_MAINTENANCE=0
MAX_GAME_INSTANCES=2
MAX_ROOMS=10
PLATFORM_MEMORY=768m
PLATFORM_CPUS=1.2
CHROMIUM_SANDBOX=0
ALLOW_MULTI_OPEN=0
EOF
  unset password token
fi
env_file="$release/deploy/online/.env"
# Each release retains its own build settings for troubleshooting; persistent
# secrets and user settings are copied without executing the .env as shell code.
sed -e 's/\r$//' -e '/^PUBLIC_PORT=/d' -e '/^PUBLIC_ORIGIN=/d' -e '/^ONLINE_BUILD_ID=/d' \
  -e '/^MAX_GAME_INSTANCES=/d' -e '/^MAX_ROOMS=/d' -e '/^PLATFORM_MEMORY=/d' -e '/^PLATFORM_CPUS=/d' -e '/^CHROMIUM_SANDBOX=/d' "$shared_env" > "$env_file"
printf '\nMAX_GAME_INSTANCES=2\nMAX_ROOMS=10\nPLATFORM_MEMORY=768m\nPLATFORM_CPUS=1.2\nCHROMIUM_SANDBOX=0\n' >> "$env_file"
printf '\nPUBLIC_PORT=%s\nPUBLIC_ORIGIN=%s\nONLINE_BUILD_ID=%s\n' "$port" "$origin" "$build" >> "$env_file"
chmod 600 "$shared_env" "$env_file"
dc() (
  cd "$release/deploy/online"
  docker compose --project-name noname-online --project-directory "$release/deploy/online" --env-file "$env_file" -f "$release/deploy/online/compose.yaml" "$@"
)
dc config --quiet

# Check the published port before touching existing services. Do not stop an
# unrelated website (including another container) to acquire port 80.
gateway_id=$(dc ps -q --status running gateway)
port_owners=''
for owner in $(docker ps -q); do
  # Docker's publish filter matches container ports; inspect HostPort instead.
  host_ports=$(docker inspect --format '{{range .NetworkSettings.Ports}}{{range .}}{{println .HostPort}}{{end}}{{end}}' "$owner")
  if grep -qx "$port" <<< "$host_ports"; then
    [[ -n $gateway_id && $gateway_id == "$owner"* ]] || die "TCP $port belongs to another container. Rerun deploy-online.cmd -HttpPort 8081 or free the port yourself."
    port_owners=$owner
  fi
done
port_hex=$(printf '%04X' "$port")
proc_tcp=(/proc/net/tcp)
[[ ! -r /proc/net/tcp6 ]] || proc_tcp+=(/proc/net/tcp6)
if awk -v port="$port_hex" '$4 == "0A" { split($2, address, ":"); if (address[2] == port) found=1 } END { exit !found }' "${proc_tcp[@]}"; then
  [[ -n $gateway_id && -n $port_owners ]] || die "TCP $port is occupied by another service. Rerun deploy-online.cmd -HttpPort 8081 or free the port yourself."
fi

maintenance="$base/shared/runtime/maintenance"
maintenance_added=0
maintenance_owned=0
switched=0
stage='initializing'
failure_reason=''
on_exit() {
  result=$?
  trap - EXIT
  if (( result != 0 )); then
    printf '\nDeployment failed (exit %s) during %s. Release: %s\n' "$result" "$stage" "$release" >&2
    dc ps --all >&2 || true
    free -m >&2 || true
    for service in database assets platform gateway; do
      container=$(dc ps -q --all "$service")
      [[ -z $container ]] || docker inspect --format '{{.Name}} OOM={{.State.OOMKilled}} {{json .State.Health}}' "$container" >&2 || true
    done
    # Avoid dumping environment variables, passwords or full request logs.
    printf 'For service logs: cd %s/deploy/online && docker compose logs --tail=100 platform\n' "$release" >&2
    if (( maintenance_added && ! switched )); then rm -f "$maintenance"; fi
    if (( switched )); then
      printf 'Maintenance remains enabled. Database and backups are retained. Fix the error and rerun the local script.\n' >&2
    fi
    if [[ -n $failure_reason ]]; then
      printf '\nDeployment blocker:\n%s\n' "$failure_reason" >&2
    fi
  fi
  exit "$result"
}
trap on_exit EXIT

printf 'Pulling service images and building the platform before stopping any existing service...\n'
stage='pulling service images'
for service in database assets gateway; do dc pull "$service"; done
# Docker 26 supports the legacy builder's per-step cgroup limits. Compose's
# runtime limits do not constrain BuildKit. Keep compilation off the host CPU
# and cap dependency installation instead of launching an unbounded builder.
stage='building platform image'
cp "$release/deploy/online/platform.Dockerfile.dockerignore" "$release/.dockerignore"
DOCKER_BUILDKIT=0 docker build --memory=512m --memory-swap=512m --cpu-period=100000 --cpu-quota=75000 \
  --tag noname-online-platform --file "$release/deploy/online/platform.Dockerfile" "$release"

platform_id=$(dc ps -q --status running platform)
if [[ ! -e $maintenance ]]; then
  printf 'noname-deployment\n' > "$maintenance"
  chmod 644 "$maintenance"
  maintenance_added=1
fi
if [[ $(cat "$maintenance") == noname-deployment ]]; then maintenance_owned=1; fi
if [[ -n $platform_id ]]; then
  stage='checking existing platform state'
  # Only query through the container. Its admin token never leaves the server.
  # The endpoint waits for already accepted room mutations before reporting.
  if platform_check=$(dc exec -T platform node --input-type=module - "$stop_active_games" 2>&1 <<'JS'
try {
  const response = await fetch('http://127.0.0.1:8082/api/v1/admin/status', {
    headers: { authorization: `Bearer ${process.env.ADMIN_STATUS_TOKEN || ''}` },
    signal: AbortSignal.timeout(15000),
  });
  if (!response.ok) throw new Error(`Platform status endpoint returned HTTP ${response.status}. Check platform logs and its admin status configuration.`);
  const status = await response.json();
  const states = status.rooms?.states;
  if (!status.ok || !states || !Number.isInteger(status.hosts?.active) || status.hosts.active < 0
      || !Object.values(states).every(count => Number.isInteger(count) && count >= 0)) {
    throw new Error('Platform status response is incomplete or invalid; cannot safely replace the existing service.');
  }
  if (status.maintenance !== true) {
    throw new Error('The running platform has not entered maintenance. Check its MAINTENANCE_FILE and runtime volume mount.');
  }
  const summary = `hosts=${status.hosts.active}, starting=${states.starting || 0}, in_game=${states.in_game || 0}`;
  if (status.hosts.active > 0 || (states.starting || 0) > 0 || (states.in_game || 0) > 0) {
    if (process.argv[2] !== '1') {
      throw new Error(`Active games block deployment (${summary}; StopActiveGames=0). Finish these games, or run deploy-online-recover.cmd to explicitly interrupt them and deploy. Double-clicking deploy-online.cmd uses normal mode. Accounts and the database are retained.`);
    }
    console.log(`Recovery explicitly requested: interrupting active games (${summary}) when replacing the platform. Current games will not resume; accounts and the database are retained.`);
  } else {
    console.log(`Existing platform is idle and in maintenance (${summary}).`);
  }
} catch (error) {
  // Never print the request, headers, environment or response body (secrets).
  console.error(error.name === 'TimeoutError'
    ? 'Platform status request timed out after 15 seconds. The existing service has been kept running.'
    : `Platform state check failed: ${error.message}`);
  process.exitCode = 1;
}
JS
  ); then
    printf '%s\n' "$platform_check"
  else
    failure_reason=$platform_check
    exit 1
  fi
fi

# Persist the intended release before replacing containers. An interrupted
# deployment can be repaired by rerunning without losing credentials.
cp "$env_file" "$shared_env.new"
chmod 600 "$shared_env.new"
mv -f "$shared_env.new" "$shared_env"
printf 'Stopping the old platform and saving a database backup...\n'
stage='stopping old platform'
switched=1
dc stop gateway platform
stage='saving database backup'
dc up -d --no-build --wait --wait-timeout 180 database
backup="$base/backups/noname-online-$release_id.dump"
dc exec -T database sh -c 'PGPASSWORD="$POSTGRES_PASSWORD" pg_dump -U noname -d noname_online -Fc' > "$backup.partial"
[[ -s "$backup.partial" ]] || die 'Database backup is empty.'
mv "$backup.partial" "$backup"
chmod 600 "$backup"

printf 'Starting database, internal game runtime, platform and API gateway...\n'
stage='starting service containers'
for service in assets platform gateway; do
  printf 'Waiting for %s health...\n' "$service"
  dc up -d --no-build --no-deps --wait --wait-timeout 120 "$service"
done
# Database readiness alone does not guarantee that the sandboxed Chromium
# required by the platform can start on this host. Verify its startup here.
stage='checking Chromium startup'
printf 'Checking Chromium startup (sandbox=%s)...\n' "$(grep '^CHROMIUM_SANDBOX=' "$env_file" | cut -d= -f2-)"
if ! dc exec -T -w /opt/noname/packages/game-host platform node --input-type=module - <<'JS'
import { chromium } from 'playwright-core';
const browser = await chromium.launch({ headless: true, chromiumSandbox: process.env.CHROMIUM_SANDBOX !== '0', timeout: 45000 });
await browser.close();
JS
then
  die 'Chromium startup check failed. On Linux 3.10 hosts, keep CHROMIUM_SANDBOX=0.'
fi

printf 'Checking the API gateway and internal game runtime release...\n'
stage='checking gateway and release'
dc exec -T platform node --input-type=module - "$build" "$release_id" <<'JS'
const build = process.argv[2];
async function get(path, json = true, host = 'gateway') {
  const response = await fetch(`http://${host}${path}`, { signal: AbortSignal.timeout(15000) });
  if (!response.ok) throw new Error(`Gateway returned ${response.status} for ${path}`);
  return json ? response.json() : response.text();
}
const status = await get('/api/v1/capabilities');
const release = await get('/deployment.json', true, 'assets');
if (!status.ok || status.build !== build || release.build !== build || release.release !== process.argv[3] || release.kind !== 'host') throw new Error('Runtime release mismatch');
for (const path of ['/index.html', '/noname/entry.js', '/vendor/vue.js', '/vendor/pinyin-pro.js', '/vendor/dedent.js']) await get(path, false, 'assets');
for (const path of ['/index.html', '/image/character/caocao.jpg', '/audio/die/caocao.mp3']) {
  const response = await fetch(`http://gateway${path}`, { signal: AbortSignal.timeout(15000) });
  if (response.status !== 404) throw new Error('Client resources must not be publicly served');
}
JS

# Also recognize deployment maintenance left by an interrupted run.
# Administrator maintenance and ONLINE_MAINTENANCE=1 are preserved.
[[ ! -e "$base/current.new" || -L "$base/current.new" ]] || die 'current.new must not be a real directory.'
ln -sfn "$release" "$base/current.new"
mv -Tf "$base/current.new" "$base/current"
if (( maintenance_owned )); then rm -f "$maintenance"; fi
stage='completed'
printf 'Remote services ready: %s/api/v1/capabilities\nBackup: %s\n' "$origin" "$backup"
dc ps
rm -f "$archive" "$(dirname "$archive")/remote-deploy.sh" || true
rmdir "$(dirname "$archive")" || true
