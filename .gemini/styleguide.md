# Flooding-Client-V2 Style Guide

Please respond and work in Korean.

This repository uses `AGENTS.md` as the shared source of truth for coding agents. Gemini CLI is configured through `.gemini/settings.json` to load `AGENTS.md` directly.

Use this file only as a review-oriented pointer. Do not duplicate or override `AGENTS.md` here.

The detailed rule files in `.claude/rules` remain the source of truth for code review. When reviewing code in this repository, apply the referenced files directly and prefer them over inferred defaults or external conventions.

Referenced rule files:

- `.claude/rules/architecture.md`
- `.claude/rules/code-style.md`
- `.claude/rules/component-convention.md`
- `.claude/rules/domain-patterns.md`
- `.claude/rules/global-patterns.md`
- `.claude/rules/api-convention.md`
- `.claude/rules/testing.md`

Review instructions:

- Read `AGENTS.md` first for shared project and automation rules.
- Use the referenced files as the authoritative review criteria for this repository.
- Do not invent additional repository-specific rules beyond the referenced files.
- If a review judgment depends on project convention, resolve it by following the referenced files first.
