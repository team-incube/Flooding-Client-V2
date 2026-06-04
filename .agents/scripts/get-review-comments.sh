#!/bin/sh
# Collect review comments from bot reviewers (gemini-code-assist, coderabbitai, copilot, etc.) on the current branch's PR.
# Not tied to a specific bot; auto-detects via user.type == "Bot".
# Usage: ./get-review-comments.sh
# Output: reviews JSON followed by inline comments JSON.

REPO=$(gh repo view --json nameWithOwner -q .nameWithOwner)
PR=$(gh pr view --json number -q .number 2>/dev/null)

if [ -z "$PR" ]; then
  echo "No pull request is linked to the current branch." >&2
  exit 1
fi

echo "=== Reviews ==="
gh api "repos/$REPO/pulls/$PR/reviews" \
  --jq '[.[] | select(.user.type == "Bot")]'

echo "=== Inline Comments ==="
gh api "repos/$REPO/pulls/$PR/comments" \
  --jq '[.[] | select(.user.type == "Bot")]'
