---
description: 깃허브 PR 생성
allowed-tools: Bash
---

# PR Title & Body Generation

Analyze the changes below and draft a PR title and body.

Current branch: !`git branch --show-current`

Commits since develop:
!`git log --oneline develop..HEAD`

Changed files:
!`git diff --stat develop..HEAD`

Diff (excluding lock files):
!`git diff develop..HEAD -- . ':(exclude)package-lock.json'`

---

## Title Rules

- Format: `<type>: <Korean summary>` (within 50 characters)
- Types: `feat`, `fix`, `refactor`, `change`, `remove`, `docs`, `chore`
- Match type to branch prefix (e.g. `feat/xxx` → `feat:`)
- Examples:
  - `feat: 기숙사 자습 신청 및 취소 기능 추가`
  - `fix: 다크모드 전환 시 배경색 깜빡임 수정`

## Body Structure

Follow the org PR template (`team-incube/.github`). Omit reviewer assignment, labels, and Discord notifications — these are handled by GitHub Actions.

```markdown
## #️⃣연관된 이슈

> ex) #이슈번호, #이슈번호

<!-- Write "없음" if no related issue -->

## 📝작업 내용

> 이번 PR에서 작업한 내용을 간략히 설명해주세요(이미지 첨부 가능)

<!-- Describe changes based on git diff. Reference FSD layers where applicable -->

### 스크린샷 (선택)

<!-- Include only if there are UI changes; otherwise remove this section -->

## 💬리뷰 요구사항(선택)

> 리뷰어가 특별히 봐주었으면 하는 부분이 있다면 작성해주세요
>
> ex) 메서드 XXX의 이름을 더 잘 짓고 싶은데 혹시 좋은 명칭이 있을까요?

<!-- Remove this section if not needed -->
```

## Output Format

1. **Title** (code block)
2. **Body** (code block)
3. **Example command**: `gh pr create --title "..." --body "..."`
