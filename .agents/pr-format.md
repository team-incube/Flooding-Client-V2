# Pull Request Format

All agents must use this format for both general PRs and release PRs.

## Title

- General PR: `<type>: <Korean summary>`
  - Allowed types: `feat`, `fix`, `refactor`, `change`, `remove`, `docs`, `chore`
  - Match the type to the branch prefix when possible.
  - Keep the title concise and under 50 characters when possible.
- Release PR: `vYYYY.MMDD.HHmm`
  - Generate the ID with Korea Standard Time.
  - Only use this title for `develop` to `main` PRs.

## Body

Use this section order:

```markdown
## #️⃣연관된 이슈

없음

## 📝작업 내용

- 작업 내용을 한국어로 작성합니다.

## 💬리뷰 요구사항

- 리뷰어가 특별히 확인해야 할 내용을 작성합니다.
```

## Body Rules

- Always remove template examples, placeholder text, HTML comments, and empty optional sections.
- If there is no related issue, write `없음` under `## #️⃣연관된 이슈`.
- If there are related issues, list issue references only, such as `#12, #34`.
- Write `## 📝작업 내용` as concise Korean bullet points.
- Include `## 💬리뷰 요구사항` only when there is a real review request.
- Do not include labels, assignees, reviewers, or Discord notification notes in the body.
- Do not include a screenshot section unless actual screenshots are attached and relevant.

## Release PR Notes

- Before drafting a release PR, read the latest merged `develop` to `main` release PR body and keep the same final section style.
- Base release contents on merged PRs and commits in the `main..develop` range.
- Prefer bullets that reference issue or PR numbers when the context is clear.
- Do not mention package version changes unless the release actually changes package metadata for a non-release-ID reason.
- Always add the `🪽 Type: Release` label: pass `--label "🪽 Type: Release"` to `gh pr create`.
