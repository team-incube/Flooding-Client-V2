#!/usr/bin/env bash
set -euo pipefail

branch="$(git branch --show-current)"
release_id="$(TZ=Asia/Seoul date '+v%Y.%m%d.%H%M')"

if [[ "$branch" == "develop" ]]; then
  pr_type="release"
  base_branch="main"
  head_branch="develop"
  compare_ref="main..develop"
else
  pr_type="general"
  base_branch="develop"
  head_branch="$branch"
  compare_ref="develop..HEAD"
fi

cat <<EOF
# PR Context

- Type: $pr_type
- Base: $base_branch
- Head: $head_branch
- Compare: $compare_ref
- KST Release ID: $release_id

## Commits
EOF

git log --oneline "$compare_ref" || true

cat <<EOF

## Changed Files
EOF

git diff --stat "$compare_ref" -- . ':(exclude)package-lock.json' || true

cat <<EOF

## Diff
EOF

git diff "$compare_ref" -- . ':(exclude)package-lock.json' || true
