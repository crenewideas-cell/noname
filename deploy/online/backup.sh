#!/usr/bin/env sh
set -eu

# Run on the deployment host from deploy/online. The database password is read
# from .env by Compose; the dump is written outside the repository volume.
backup_dir="${BACKUP_DIR:-/var/backups/noname-online}"
mkdir -p "$backup_dir"
stamp="$(date -u +%Y%m%dT%H%M%SZ)"
file="$backup_dir/noname-online-$stamp.dump"
docker compose exec -T database sh -c 'PGPASSWORD="$POSTGRES_PASSWORD" pg_dump -U noname -d noname_online -Fc' > "$file"
chmod 600 "$file"
find "$backup_dir" -type f -name 'noname-online-*.dump' -mtime +14 -delete
printf 'database backup written to %s\n' "$file"
