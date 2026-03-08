---
description: 깃허브 PR 제목 추천
allowed-tools: Bash
---

# PR 제목 추천

아래 정보를 바탕으로 PR 제목을 추천해줘.

Current branch: !`git branch --show-current`

Commits since develop:
!`git log --oneline develop..HEAD`

Changed files:
!`git diff --stat develop..HEAD`

---

## Title Rules

- `<type>: <한국어 요약>` (50자 이내)
- Types: `feat`, `fix`, `refactor`, `change`, `remove`, `docs`, `chore`
- 브랜치 prefix와 타입 일치 (e.g. `feat/xxx` → `feat:`)
- 예시: `feat: 기숙사 자습 신청 및 취소 기능 추가`
