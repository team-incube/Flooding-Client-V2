---
name: commit
description: 깃허브 커밋 메시지 작성
allowed-tools: Read
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

- Before committing, check the current branch.
- If the current branch is `develop`, do not commit directly.
- Propose a new branch name using the `type/description` format based on the intended commit.
- Confirm the branch name with the user before creating it.
- After confirmation, create and checkout the branch with `git checkout -b <branch-name>`, then commit on that branch.
- If the current branch is not `develop`, continue with the normal commit flow.

## Rules

- Write commit messages in Korean
- Directory naming: kebab-case
- File naming follows project conventions by role; Markdown documents are an exception
- Keep commits focused and atomic
- Write commit messages in the smallest possible units.
