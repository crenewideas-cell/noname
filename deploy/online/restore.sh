#!/usr/bin/env sh
set -eu

if [ "${CONFIRM_RESTORE:-}" != "YES" ]; then
  printf '%s\n' 'This replaces the online database. Set CONFIRM_RESTORE=YES after stopping platform and gateway.' >&2
  exit 2
fi
if [ "$#" -ne 1 ]; then
  printf 'usage: CONFIRM_RESTORE=YES %s backup.dump\n' "$0" >&2
  exit 2
fi
docker compose stop platform gateway
docker compose exec -T database sh -c 'PGPASSWORD="$POSTGRES_PASSWORD" pg_restore -U noname -d noname_online --clean --if-exists --no-owner' < "$1"
printf '%s\n' 'database restore completed; start the services after reviewing the dump source.'
