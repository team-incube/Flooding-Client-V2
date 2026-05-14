#!/usr/bin/env bash
set -euo pipefail

branch="$(git branch --show-current)"

cat <<EOF
# Commit Context

- Branch: $branch
EOF

if [[ "$branch" == "develop" ]]; then
  cat <<EOF
- Warning: current branch is develop. Do not commit directly to develop.
EOF
fi

cat <<EOF

## Working Tree
EOF

git status --short --untracked-files=all

cat <<EOF

## Changed Files
EOF

git diff --name-status

cat <<EOF

## Unstaged Diff Stat
EOF

git diff --stat

cat <<EOF

## Staged Diff Stat
EOF

git diff --cached --stat

cat <<EOF

## Recent Commits
EOF

git log --oneline -5
