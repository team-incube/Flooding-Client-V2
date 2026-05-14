---
name: commit
description: 깃허브 커밋 메시지 작성
allowed-tools: Bash, Read
---

# Git Commit Convention

## Commit Types

| Type        | Meaning                         |
| ----------- | ------------------------------- |
| `feat:`     | New feature                     |
| `change:`   | Modify existing feature         |
| `refactor:` | Code refactoring                |
| `fix:`      | Bug fix                         |
| `remove:`   | Delete code/files               |
| `docs:`     | Documentation changes           |
| `chore:`    | Build, package manager settings |

## Branching Strategy

- Branch format: `type/description` (e.g., `feat/add-login`, `fix/token-refresh`, `docs/update-rules`, `refactor/improve-layout`)
- Merge via PR → `develop`

## Commit Workflow

- Before committing, run `bash .agents/scripts/commit-context.sh` to inspect the current branch, working tree, changed files, diff stats, staged changes, and recent commits.
- If the current branch is `develop`, do not commit directly.
- Propose a new branch name using the `type/description` format based on the intended commit.
- Confirm the branch name with the user before creating it.
- After confirmation, create and checkout the branch with `git checkout -b <branch-name>`, then commit on that branch.
- If the current branch is not `develop`, continue with the normal commit flow.
- Before staging or committing, inspect file-level diffs with `bash .agents/scripts/commit-diff.sh <files...>` as needed.
- Group changed files by commit intent autonomously. Do not default to a single commit when unrelated changes are present.
- Present the planned commit groups to the user before staging:
  - files included in each group
  - commit type
  - Korean commit message
- Get explicit user approval for each commit group before staging or committing that group.
- Run `git add`, `git commit`, and `git checkout -b` with escalated filesystem permission when the environment requires Git metadata writes.
- If `git add`, `git commit`, or `git checkout -b` fails with `.git/index.lock` or another Git metadata permission error, immediately retry the same command with escalated filesystem permission.
- Use a narrow approval prefix for repeated Git commit operations, such as `["git", "commit"]`, instead of requesting broad shell access.
- Treat tool/sandbox permission approval separately from commit-content approval. A permission approval does not approve the commit contents.
- After each approved commit, re-check the remaining changes and repeat the grouping and approval flow until no intended changes remain.
- If the user says "commit now" or "바로 커밋", still split commits by intent when multiple independent changes are present.

## Rules

- Write commit messages in Korean
- Directory naming: kebab-case
- File naming follows project conventions by role; Markdown documents are an exception
- Keep commits focused and atomic
- Write commit messages in the smallest possible units.
- A single commit must represent a single intent.
- Split package updates, configuration changes, documentation changes, feature changes, refactors, and file moves into separate commits when possible.
- Keep related lockfile and manifest changes together, such as `package.json` with `package-lock.json`.
