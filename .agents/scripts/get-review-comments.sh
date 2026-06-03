#!/bin/sh
# 현재 브랜치 PR의 gemini-code-assist 리뷰 코멘트를 수집한다.
# 사용법: ./get-review-comments.sh
# 출력: reviews JSON과 inline comments JSON을 순서대로 출력한다.

REPO=$(gh repo view --json nameWithOwner -q .nameWithOwner)
PR=$(gh pr view --json number -q .number 2>/dev/null)

if [ -z "$PR" ]; then
  echo "현재 브랜치에 연결된 PR이 없습니다." >&2
  exit 1
fi

echo "=== Reviews ==="
gh api "repos/$REPO/pulls/$PR/reviews" \
  --jq '[.[] | select(.user.login | test("gemini-code-assist"))]'

echo "=== Inline Comments ==="
gh api "repos/$REPO/pulls/$PR/comments" \
  --jq '[.[] | select(.user.login | test("gemini-code-assist"))]'
