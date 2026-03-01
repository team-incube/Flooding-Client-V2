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

- Branch format: `type/description` (e.g., `feat/기능명`, `fix/버그수정`, `docs/문서개선`, `refactor/리팩토링`)
- Merge via PR → `develop`

## Rules

- Write commit messages in Korean
- File/directory naming: kebab-case
- Keep commits focused and atomic
- Write commit messages in the smallest possible units.
