---
name: refactor
description: Refactoring standards for testable, maintainable code
allowed-tools: Read
---

# Code Quality Refactoring Guide

Goal: establish consistent standards for separating concerns, naming, and architecture
so the codebase stays testable and maintainable as it grows.

---

## Rule Files

| Rule | File | Status |
| ---- | ---- | ------ |
| UI / Business Logic Separation | `rules/separate-business-logic.md` | ✅ Done |
| Naming Convention Standardization | `rules/naming-convention.md` | 🔲 Pending |
| FSD Architecture Enforcement | `rules/fsd-architecture.md` | 🔲 Pending |
| Vitest Unit Test Standards | `rules/vitest-unit-test.md` | 🔲 Pending |

---

## How to Use

Identify which rule applies to the task at hand, then read the corresponding file:

```
Read: .claude/skills/refactor/rules/separate-business-logic.md
```

Apply all rules from the file before writing or modifying any code.

---

## Adding a New Rule

1. Create `rules/<kebab-case-name>.md` with the established standards
2. Add a row to the table above and mark it ✅
3. Keep each rule file self-contained — it should be readable independently
