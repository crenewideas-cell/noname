# Windows PowerShell 5.1 / PowerShell 7. ASCII keeps double-click execution
# compatible with Windows PowerShell's default file encoding.
[CmdletBinding()]
param(
    [ValidatePattern('^[a-zA-Z0-9][a-zA-Z0-9.-]*$')][string]$Server = '139.196.192.5',
    [ValidatePattern('^[a-z_][a-z0-9_-]*$')][string]$User = 'root',
    [ValidateRange(1, 65535)][int]$SshPort = 22,
    [ValidateRange(1, 65535)][int]$HttpPort = 80,
    [ValidatePattern('^/opt/[a-zA-Z0-9_-]+$')][string]$RemoteDirectory = '/opt/noname-online'
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'
$root = [IO.Path]::GetFullPath((Join-Path $PSScriptRoot '..'))
$oldPath = $env:PATH
$oldBuild = $env:VITE_ONLINE_BUILD_ID
$oldOrigin = $env:VITE_ONLINE_ORIGIN
$oldNodeEnv = $env:NODE_ENV
$oldLocation = Get-Location
$deploymentLock = $null

function Invoke-External {
    param([string]$File, [string[]]$Arguments)
    & $File @Arguments
    if ($LASTEXITCODE -ne 0) { throw "$File failed (exit $LASTEXITCODE). Deployment stopped." }
}

function Quote-Sh([string]$Value) {
    # All remote paths/identifiers are generated or validated to this alphabet.
    if ($Value -notmatch '^[a-zA-Z0-9_./:@+-]+$') { throw 'Unsafe remote argument.' }
    return "'$Value'"
}

try {
    Set-Location -LiteralPath $root
    New-Item -ItemType Directory -Force -Path (Join-Path $root 'output') | Out-Null
    try {
        $deploymentLock = [IO.File]::Open((Join-Path $root 'output/online-deploy.lock'),
            [IO.FileMode]::OpenOrCreate, [IO.FileAccess]::ReadWrite, [IO.FileShare]::None)
    } catch { throw 'Another deployment is using this checkout. Wait for it to finish.' }
    foreach ($name in @('ssh.exe', 'scp.exe', 'ssh-keygen.exe', 'tar.exe', 'node.exe', 'npm.cmd')) {
        if (-not (Get-Command $name -ErrorAction SilentlyContinue)) {
            throw "Missing $name. Install Node.js 22.18+ (or 24.2+) and Windows OpenSSH Client, then retry."
        }
    }
    $nodeVersionText = & node.exe -p 'process.versions.node'
    if ($LASTEXITCODE -ne 0) { throw 'Cannot read Node.js version.' }
    $nodeVersion = [version]$nodeVersionText
    if (-not (($nodeVersion.Major -eq 22 -and $nodeVersion -ge [version]'22.18.0') -or $nodeVersion -ge [version]'24.2.0')) {
        throw 'Use Node.js 22.18+ LTS or Node.js 24.2+ LTS (the build uses import.meta.main).'
    }
    $origin = "http://${Server}"
    if ($HttpPort -ne 80) { $origin += ":$HttpPort" }
    $releaseId = (Get-Date).ToUniversalTime().ToString('yyyyMMddTHHmmssZ') + '-' + [guid]::NewGuid().ToString('N').Substring(0, 8)
    $target = "${User}@${Server}"
    $sshDirectory = Join-Path ([Environment]::GetFolderPath('UserProfile')) '.ssh'
    New-Item -ItemType Directory -Force -Path $sshDirectory | Out-Null
    $key = Join-Path $sshDirectory "noname_${Server}_${SshPort}_${User}_ed25519"
    $sshOptions = @('-p', "$SshPort", '-i', $key, '-o', 'IdentitiesOnly=yes',
        '-o', 'StrictHostKeyChecking=accept-new', '-o', 'ConnectTimeout=15',
        '-o', 'ServerAliveInterval=15', '-o', 'ServerAliveCountMax=8')
    if (-not (Test-Path -LiteralPath $key)) {
        Write-Host '[1/6] Creating a dedicated deployment SSH key...'
        # ProcessStartInfo preserves the empty -N argument in both PS 5.1 and 7.
        $startInfo = New-Object System.Diagnostics.ProcessStartInfo
        $startInfo.FileName = (Get-Command ssh-keygen.exe).Source
        $startInfo.UseShellExecute = $false
        $startInfo.Arguments = '-q -t ed25519 -N "" -C noname-deploy -f "' + $key + '"'
        $process = [Diagnostics.Process]::Start($startInfo)
        $process.WaitForExit()
        if ($process.ExitCode -ne 0) { throw 'SSH key generation failed.' }
        $process.Dispose()
    }
    if (-not (Test-Path -LiteralPath "$key.pub")) { throw "Missing $key.pub. Restore the matching public key before retrying." }
    $publicKey = (Get-Content -LiteralPath "$key.pub" -Raw).Trim()
    if ($publicKey -notmatch '^ssh-ed25519 [A-Za-z0-9+/=]+(?: [^\r\n]*)?$') { throw 'Invalid deployment public key.' }
    # Do not embed comments supplied by an external key file in shell commands.
    $publicKey = ($publicKey -split ' ')[0..1] -join ' '
    $publicKey += ' noname-deploy'

    Write-Host "[1/6] Connecting to $target (SSH port $SshPort)..."
    & ssh.exe @sshOptions -o BatchMode=yes $target 'true'
    if ($LASTEXITCODE -ne 0) {
        Write-Host 'First deployment: enter the server login password once. The password is never stored.'
        $installKey = "umask 077; mkdir -p ~/.ssh && chmod 700 ~/.ssh && touch ~/.ssh/authorized_keys && chmod 600 ~/.ssh/authorized_keys && { grep -qxF '$publicKey' ~/.ssh/authorized_keys || printf '\n%s\n' '$publicKey' >> ~/.ssh/authorized_keys; }"
        Invoke-External 'ssh.exe' ($sshOptions + @('-o', 'NumberOfPasswordPrompts=1', $target, $installKey))
        Invoke-External 'ssh.exe' ($sshOptions + @('-o', 'BatchMode=yes', $target, 'true'))
    }
    $sshOptions += @('-o', 'BatchMode=yes')
    # Non-root logins must already have passwordless sudo; never request a
    # second password or make persistent changes to sudoers.
    $preflight = 'command -v bash >/dev/null && command -v tar >/dev/null && { [ $(id -u) -eq 0 ] || sudo -n true; }'
    Invoke-External 'ssh.exe' ($sshOptions + @($target, $preflight))

    Write-Host '[2/6] Preparing pnpm 10.34.5 and installing core build dependencies...'
    $toolsDirectory = Join-Path $root 'output/deploy-tools'
    $pnpmPackage = Join-Path $toolsDirectory 'node_modules/pnpm/package.json'
    $hasPnpm = (Test-Path -LiteralPath $pnpmPackage) -and ((Get-Content -LiteralPath $pnpmPackage -Raw | ConvertFrom-Json).version -eq '10.34.5')
    $env:NODE_ENV = 'development'
    if (-not $hasPnpm) {
        Invoke-External 'npm.cmd' @('install', '--prefix', $toolsDirectory, '--no-audit', '--no-fund', '--ignore-scripts', 'pnpm@10.34.5')
    }
    $env:PATH = (Join-Path $toolsDirectory 'node_modules/.bin') + [IO.Path]::PathSeparator + $env:PATH
    # Existing modules may need rebuilding for this filtered install. CI mode
    # avoids concurrent workspace confirmation prompts sharing the console.
    $installOldCi = $env:CI
    try {
        $env:CI = 'true'
        Invoke-External 'pnpm.cmd' @('--filter', '.', '--filter', 'noname...', 'install', '--frozen-lockfile', '--prod=false', '--reporter=append-only')
    } finally {
        $env:CI = $installOldCi
    }

    Write-Host '[3/6] Building server game runtime (without client media)...'
    $env:VITE_ONLINE_ORIGIN = $origin
    $env:NODE_ENV = 'production'
    Invoke-External 'pnpm.cmd' @('build:online')
    $runtimeManifest = Get-Content -LiteralPath (Join-Path $root 'dist-online-host/deployment.json') -Raw | ConvertFrom-Json
    $buildId = $runtimeManifest.build
    if ($buildId -notmatch '^online-[a-f0-9]{20}$' -or $runtimeManifest.kind -ne 'host') { throw 'Invalid host runtime manifest.' }
    foreach ($file in @('index.html', 'noname/entry.js', 'vendor/vue.js', 'vendor/pinyin-pro.js', 'vendor/dedent.js')) {
        if (-not (Test-Path -LiteralPath (Join-Path $root "dist-online-host/$file") -PathType Leaf)) { throw "Missing host runtime artifact: $file" }
    }
    # The internal marker also distinguishes repeated deployments of one build.
    $utf8 = New-Object System.Text.UTF8Encoding($false)
    [IO.File]::WriteAllText((Join-Path $root 'dist-online-host/deployment.json'),
        ((@{ build = $buildId; origin = $origin; kind = 'host'; release = $releaseId } | ConvertTo-Json -Compress) + "`n"), $utf8)

    Write-Host '[4/6] Packaging server runtime and deployment files (no client media)...'
    $work = Join-Path $root "output/remote-deploy/$releaseId"
    New-Item -ItemType Directory -Force -Path $work | Out-Null
    $archive = Join-Path $work 'release.tar.gz'
    $files = @('dist-online-host',
        'deploy/online/compose.yaml', 'deploy/online/Caddyfile', 'deploy/online/Assets.Caddyfile',
        'deploy/online/platform.Dockerfile', 'deploy/online/platform.Dockerfile.dockerignore',
        'deploy/online/platform-workspace.json', 'deploy/online/platform-workspace.yaml',
        'deploy/online/seccomp_profile.json', 'deploy/online/THIRD_PARTY.md', 'deploy/online/LICENSE.Playwright',
        'deploy/online/backup.sh', 'deploy/online/restore.sh', 'deploy/online/maintenance.sh',
        'packages/server/package.json', 'packages/server/pnpm-lock.yaml', 'packages/server/src',
        'packages/game-host/package.json', 'packages/game-host/pnpm-lock.yaml', 'packages/game-host/src',
        'packages/online-protocol/package.json', 'packages/online-protocol/src')
    Invoke-External 'tar.exe' (@('-czf', $archive, '-C', $root) + $files)
    $sha256 = (Get-FileHash -LiteralPath $archive -Algorithm SHA256).Hash.ToLowerInvariant()
    $helper = Join-Path $work 'remote-deploy.sh'
    $helperText = [IO.File]::ReadAllText((Join-Path $root 'deploy/online/remote-deploy.sh')).Replace("`r`n", "`n")
    [IO.File]::WriteAllText($helper, $helperText, $utf8)
    $remoteUpload = "/tmp/noname-online-upload-$releaseId"
    Invoke-External 'ssh.exe' ($sshOptions + @($target, "umask 077; mkdir $(Quote-Sh $remoteUpload)"))
    $scpOptions = @('-P', "$SshPort", '-i', $key, '-o', 'IdentitiesOnly=yes', '-o', 'BatchMode=yes',
        '-o', 'StrictHostKeyChecking=accept-new', '-o', 'ConnectTimeout=15', '-o', 'ServerAliveInterval=15', '-o', 'ServerAliveCountMax=8')
    Invoke-External 'scp.exe' ($scpOptions + @($archive, $helper, "${target}:${remoteUpload}/"))

    Write-Host '[5/6] Deploying services with the existing remote Docker engine...'
    $remoteArgs = @("$remoteUpload/remote-deploy.sh", "$remoteUpload/release.tar.gz", $sha256,
        $RemoteDirectory, $releaseId, $origin, "$HttpPort", $buildId)
    $remoteCommand = 'bash ' + (($remoteArgs | ForEach-Object { Quote-Sh $_ }) -join ' ')
    $remoteCommand = 'if [ $(id -u) -eq 0 ]; then ' + $remoteCommand + '; else sudo -n ' + $remoteCommand + '; fi'
    Invoke-External 'ssh.exe' ($sshOptions + @($target, $remoteCommand))

    Write-Host '[6/6] Checking the public HTTP entry from this computer...'
    # These are deployment readiness checks, not a test suite. They only run
    # when the user launches this script, after the remote services start.
    $ready = $false
    $lastError = ''
    for ($attempt = 0; $attempt -lt 6; $attempt++) {
        try {
            $capabilities = Invoke-RestMethod -Uri "$origin/api/v1/capabilities" -TimeoutSec 15 -Headers @{ 'Cache-Control' = 'no-cache' }
            if (-not $capabilities.ok -or $capabilities.build -ne $buildId) {
                throw 'The HTTP entry did not serve the expected release.'
            }
            $ready = $true
            break
        } catch { $lastError = $_.Exception.Message; Start-Sleep -Seconds 5 }
    }
    if (-not $ready) {
        throw "Remote startup completed, but public HTTP is not ready: $lastError Check the cloud security group / firewall inbound TCP $HttpPort. Then rerun this script."
    }
    # Delete only this run's generated files, never a computed directory tree.
    Remove-Item -LiteralPath $archive, $helper
    Write-Host "Deployment succeeded: $origin/api/v1/capabilities" -ForegroundColor Green
    Write-Host "Build: $buildId | Remote directory: $RemoteDirectory"
    Write-Host 'Players must use the matching downloaded client. The server does not serve a game webpage.'
    Write-Host 'Next deployment: run deploy-online.cmd again. SSH will use the saved key.'
} catch {
    Write-Host "ERROR: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
} finally {
    if ($null -ne $deploymentLock) { $deploymentLock.Dispose() }
    $env:PATH = $oldPath
    $env:VITE_ONLINE_BUILD_ID = $oldBuild
    $env:VITE_ONLINE_ORIGIN = $oldOrigin
    $env:NODE_ENV = $oldNodeEnv
    Set-Location -LiteralPath $oldLocation
}
