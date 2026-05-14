#!/usr/bin/env bash
set -euo pipefail

if [[ "$#" -eq 0 ]]; then
  git diff
  exit 0
fi

git diff -- "$@"
