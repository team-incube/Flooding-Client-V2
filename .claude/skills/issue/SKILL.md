---
name: issue
description: 깃허브 이슈 생성
allowed-tools: Bash, mcp__github__issue_write
---

# GitHub Issue Creation

사용자 입력을 분석하여 하단 템플릿 기반으로 이슈를 생성한다.

Current branch: !`git **branch** --show-current`

Recent commits:
!`git log --oneline -5`

---

## Issue Types

| Type   | Title Prefix | Label                       | Template           |
| ------ | ------------ | --------------------------- | ------------------ |
| `bug`  | `[BUG]`      | `🐞 Type: Bug/Function`     | bug-report.md      |
| `feat` | `[Task]`     | `📩 Type: Feature/Function` | feature-request.md |

## Body Templates

**`bug` — `bug-report.md`:**

```markdown
## 🐞 증상

---

> 버그에 대한 증상을 적어주세요.

## 🤔문제 상황

---

> 문제 상황을 재현할 수 있도록 재현 방법을 적어주세요.
```

**`feat` — `feature-request.md`:**

```markdown
## 📝 개요

---

> 추가 할 기능에 대한 설명을 적어주세요.

## 📆 소요 시간

---

> 해당 작업을 완료하는데 소요되는 예상 시간을 적어주세요.(e.g. `2025/02/07`~`2025/02/14`)

## 📌 해야 할 일

---

- [ ] 해야 할 일을 적어주세요.
- [ ] 해야 할 일을 적어주세요.
```

## Output & Execution

1. 사용자 입력(args)에서 타입(`bug` / `feat`)과 핵심 내용을 파악한다.
   - args가 없으면 어떤 이슈인지 물어본다.
2. 타입에 맞는 title prefix, label, body 템플릿을 선택한다.
3. 컨텍스트(브랜치, 커밋 로그)를 참고해 본문 내용을 채운다.
4. `mcp__github__issue_write`로 이슈를 생성한다:
   - `owner`: `Dino0204`
   - `repo`: `Train`
   - `title`: `[BUG] 내용` 또는 `[Task] 내용`
   - `body`: 작성된 본문
   - `labels`: 타입에 맞는 라벨
5. 생성된 이슈 URL을 반환한다.
