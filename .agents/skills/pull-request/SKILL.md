---
name: pull-request
description: 깃허브 PR 생성
allowed-tools: Bash, mcp__github__create_pull_request, mcp__github__get_me
---

# PR Title & Body Generation

Analyze the changes below, draft a PR title and body, then create the PR using GitHub MCP.

Current branch: !`git branch --show-current`

Current KST release ID:
!`TZ=Asia/Seoul date '+v%Y.%m%d.%H%M'`

Commits since develop:
!`git log --oneline develop..HEAD`

Changed files:
!`git diff --stat develop..HEAD`

Diff (excluding lock files):
!`git diff develop..HEAD -- . ':(exclude)package-lock.json'`

---

## Branching Strategy

The PR type is determined by the title format.

| Title Format                                | Base Branch | Condition                                     |
| ------------------------------------------- | ----------- | --------------------------------------------- |
| `vYYYY.MMDD.HHmm` (release ID)              | `main`      | Only allowed when current branch is `develop` |
| `feat:`, `fix:`, etc. (conventional commit) | `develop`   | Allowed from any feature branch               |

**Release PR rules** (`vYYYY.MMDD.HHmm` format):

- Must be created from the `develop` branch only.
- Use the current Korea Standard Time (Asia/Seoul) to generate the release ID.
- Release IDs are GitHub PR/tag/release identifiers only.
- Do not update or compare `package.json` / `package-lock.json` versions for release PRs.
- If the current branch is not `develop`, print an error message and abort.

## Title Rules

- **General PR**: `<type>: <Korean summary>` (within 50 characters)
  - Types: `feat`, `fix`, `refactor`, `change`, `remove`, `docs`, `chore`
  - Match type to branch prefix (e.g. `feat/xxx` → `feat:`)
  - Example: `feat: 기숙사 자습 신청 및 취소 기능 추가`
- **Release PR**: `vYYYY.MMDD.HHmm` format
  - Example: `v2026.0510.0109`

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

## Output & Execution

1. Finalize the **Title** and **Body**.
2. Determine the base branch:
   - If the current branch is develop, create a release PR:
     - Title: current KST release ID in vYYYY.MMDD.HHmm format
     - Base: main
   - Otherwise → develop
3. Create the PR directly using **GitHub MCP** (`mcp__github__create_pull_request`):
   - `owner`: `team-incube`
   - `repo`: `Flooding-Client-V2`
   - `head`: current branch
   - `base`: branch determined above
4. Return the created PR URL to the user.
