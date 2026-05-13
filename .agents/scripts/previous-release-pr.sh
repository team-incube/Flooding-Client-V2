#!/usr/bin/env bash
set -euo pipefail

repo="${GITHUB_REPOSITORY:-team-incube/Flooding-Client-V2}"

gh pr list \
  --repo "$repo" \
  --base main \
  --head develop \
  --state merged \
  --limit 20 \
  --json number,title,body,url,mergedAt \
  --jq 'map(select(.title | test("^v[0-9]{4}\\.[0-9]{4}\\.[0-9]{4}$"))) | sort_by(.mergedAt) | reverse | .[0] // empty'
