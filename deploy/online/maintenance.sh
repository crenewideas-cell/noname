#!/usr/bin/env sh
set -eu

runtime_dir="$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)/runtime"
mkdir -p "$runtime_dir"
case "${1:-}" in
  on)
    touch "$runtime_dir/maintenance"
    printf '%s\n' 'maintenance enabled; new rooms and matches are now rejected.'
    ;;
  off)
    rm -f "$runtime_dir/maintenance"
    printf '%s\n' 'maintenance disabled; new rooms and matches are allowed.'
    ;;
  *)
    printf 'usage: %s on|off\n' "$0" >&2
    exit 2
    ;;
esac
