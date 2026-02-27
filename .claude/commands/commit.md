---
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

- Branch format: `feat/기능명`, `fix/버그명`
- Merge via PR → `develop`

## Rules

- Write commit messages in Korean
- File/directory naming: kebab-case
- Keep commits focused and atomic
