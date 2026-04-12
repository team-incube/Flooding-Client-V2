---
name: worktree
description: Create and manage git worktrees for parallel Claude sessions per task unit
allowed-tools: Bash
---

# Git Worktree Manager

Use this skill when you have multiple independent tasks (e.g. per-domain API integration) to work on in parallel. Each task gets its own worktree and a dedicated Claude session running via `claude --worktree`.

Current branch: !`git branch --show-current`

Existing worktrees:
!`git worktree list`

---

## Actions

| Action   | Usage                                | Description                        |
| -------- | ------------------------------------ | ---------------------------------- |
| (none)   | `/worktree feat/a feat/b fix/c`      | Create worktrees (default action)  |
| `list`   | `/worktree list`                     | Show current worktrees             |
| `remove` | `/worktree remove feat/a feat/b`     | Remove worktrees and prune         |

## Path Convention

Replace `/` in branch names with `-` and place the worktree in the parent directory.

| Branch            | Worktree path                                  |
| ----------------- | ---------------------------------------------- |
| `feat/club-api`   | `../Flooding-Client-V2-feat-club-api`          |
| `fix/header`      | `../Flooding-Client-V2-fix-header`             |

## Output & Execution

**If no args are provided, print usage and exit.**

### Default / `add` — Create worktrees

1. Parse branch names from args (when the first arg is not `list` or `remove`).
2. Determine the base branch: use `develop` if it exists, otherwise use the current branch.
3. For each branch name:
   - Compute path: `../Flooding-Client-V2-<branch-with-slashes-as-hyphens>`
   - Check if branch exists: `git branch --list <branch>`
     - Not found: `git worktree add -b <branch> <path> <base>`
     - Found: `git worktree add <path> <branch>`
   - Report success or failure
4. After all worktrees are created, print the commands to run in each new terminal window:

```
Worktrees created. Open a new terminal window for each and run:

  Window 1: cd ../Flooding-Client-V2-feat-club-api && claude --worktree
  Window 2: cd ../Flooding-Client-V2-feat-dormitory-api && claude --worktree
  Window 3: cd ../Flooding-Client-V2-feat-user-api && claude --worktree
```

### `list` — Show worktrees

Run `git worktree list` and print the output.

### `remove` — Remove worktrees

1. Parse branch names from args.
2. For each branch name, compute the path and run `git worktree remove --force <path>`.
3. After all removals, run `git worktree prune`.
4. Report results.
