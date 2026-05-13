---
name: pull-request
description: 깃허브 PR 생성
allowed-tools: Bash, mcp__github__create_pull_request, mcp__github__get_me
---

# PR Title & Body Generation

Analyze the PR context, draft a PR title and body, then create the PR using GitHub MCP.

Shared agent rules:
!`sed -n '1,220p' AGENTS.md`

PR format rules:
!`sed -n '1,220p' .agents/pr-format.md`

PR context:
!`bash .agents/scripts/pr-context.sh`

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
- Before drafting the body, run `bash .agents/scripts/previous-release-pr.sh` and read the latest merged release PR.
- Use the previous release PR body as a format reference and as a check against missing or duplicated release notes.

## Title Rules

- **General PR**: `<type>: <Korean summary>` (within 50 characters)
  - Types: `feat`, `fix`, `refactor`, `change`, `remove`, `docs`, `chore`
  - Match type to branch prefix (e.g. `feat/xxx` → `feat:`)
  - Example: `feat: 기숙사 자습 신청 및 취소 기능 추가`
- **Release PR**: `vYYYY.MMDD.HHmm` format
  - Example: `v2026.0510.0109`

## Body Structure

Follow `.agents/pr-format.md` for both general PRs and release PRs. Omit reviewer assignment, labels, and Discord notifications because these are handled by GitHub Actions.

Do not leave template examples, placeholder text, HTML comments, or empty optional sections in the final body.

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
4. Do not attach labels from this skill. Release labels are handled by `.github/labeler.yml`.
5. Return the created PR URL to the user.
