---
name: resolve-review
description: Parse code review comments left by bot reviewers (gemini-code-assist, coderabbitai, copilot, etc.) on the current PR, apply the suggested fixes to the code, then reply to each review comment thread mentioning that reviewer with a summary of what was addressed.
---

# Resolve Review

Run the workflow that fetches and applies bot reviewer comments on the current branch's PR. This skill is not tied to a specific bot; it auto-detects whichever bot reviewers are present on the PR.

## Workflow

### 1. Check the PR

```bash
gh pr view --json number,url
```

- Confirm there is a PR linked to the current branch.
- If there is no PR: print "No pull request is linked to the current branch." and stop.
- Do not pre-check for a specific bot. Which bot reviewers left comments is determined by the collection step below.

### 2. Collect review comments

```bash
.agents/scripts/get-review-comments.sh
```

- This script collects review and inline comments from bot reviewers using `user.type == "Bot"` (works for any bot: gemini-code-assist, coderabbitai, copilot, etc.).
- Organize comments by file path, line number, the issue raised, and the author (`user.login`).
- Record each inline comment's `id` (comment_id) — it is used in step 5 to reply to that thread.
- If both Reviews and Inline Comments are empty: print "No bot reviewer comments found." and stop.
- If the review state is only `APPROVED` with no inline comments: print "The review is already approved." and stop.

### 3. Classify the comments

Classify each comment using the criteria below:

| Class | Criteria | Action |
|-------|----------|--------|
| Fix | Style violations or logic improvements (formatting, naming, unused imports, type assertions, etc.) | Modify the code |
| Skip | Praise / non-actionable comments | Do not modify; record in the list |

- For items that conflict with project conventions or need intent clarification, ask the user in the terminal before modifying.

### 4. Apply code fixes

- Modify the code for each actionable comment, by file/line.
- Follow the code conventions in AGENTS.md (`code style`, `architecture`, `component conventions`, etc.).
- After editing, Claude hooks automatically run ESLint + Prettier.

### 5. Reply to each review comment thread

Do not leave a single summary comment on the PR body. Instead, reply individually to each inline comment thread (comment_id) collected in step 2.

```bash
gh api repos/{owner}/{repo}/pulls/{pr_number}/comments/{comment_id}/replies \
  -f body="@{reviewer} ..."
```

- Build `{reviewer}` dynamically from the comment author (`user.login`) with the `[bot]` suffix stripped. (e.g. `gemini-code-assist[bot]` → `@gemini-code-assist`, `coderabbitai[bot]` → `@coderabbitai`) Never hardcode a specific bot name.
- Every reply starts with the corresponding reviewer mention.
- For each comment, write one of:
  - If fixed: what was changed and how, plus the commit hash.
  - If skipped: the reason for skipping.
- Even if the same issue repeats across multiple files, reply on each comment thread for that file.

**Reply format example:**

```
@{reviewer} Thanks for the feedback. Fixed by {summary of change}. (commit {commit_hash})
```

## Notes

- When multiple comments target the same file, edit from the bottom line upward (reverse order).
- If a type error occurs during edits, stop immediately and report the cause to the user.
- Report results only as replies on each review comment thread, not as a summary comment on the PR body.
- Always generate the reply mention from the comment author dynamically; never assume a specific bot name.
