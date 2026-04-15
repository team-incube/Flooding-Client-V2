## Flooding-Client-V2

Please respond and work in Korean.

## Project Overview

Integrated school management system for dormitory, clubs, and home bases.

- **Next.js 16 (App Router)** + **React 19** + **TypeScript 5 (strict)**
- **TailwindCSS v4** – CSS variable-based design system
- **TanStack React Query v5** – server state management
- **Axios** – HTTP client · **Sonner** – toast notifications
- **React Compiler** (Babel plugin) – auto memoization enabled

## Common Commands

```bash
npm run dev      # Start dev server (localhost:3000)
npm run build    # Production build
npm run lint     # Run ESLint
```

## Architecture – Feature-Sliced Design (FSD)

```
src/
├── entities/     # Domain models (club, dormitory, school, user)
├── features/     # Feature modules (massage-chair, self-study, wake-up-song)
├── shared/       # Reusable code
│   ├── api/      # API client setup
│   ├── asset/svg/# SVG icon components
│   ├── config/   # App configuration
│   ├── model/    # Shared TypeScript types
│   └── ui/       # Shared UI components
└── widgets/      # Composite widgets
```

**Layer import rule**: `app → widgets → features → entities → shared` (only downward imports allowed)
**Path alias**: `@/` → `src/`

## Design System

Theme is defined via CSS variables in `app/globals.css` — **no tailwind.config.ts** (TailwindCSS v4 uses `@theme inline`).

**Color tokens**: `color-p-1` (primary), `color-main-text`, `color-sub-1`~`sub-4`, `color-negative`, `background`, `background-surface`

**Dark mode**: Toggle `.dark` / `.light` class on `<html>`. State persisted in `localStorage`.

**Typography**: SUIT Variable font. Use `title-1`~`title-3`, `text-1`~`text-3`, `caption-1`~`caption-3` Tailwind utilities.

## Code Conventions

- **Directory names**: kebab-case
- **File names**: Follow project conventions by role; Markdown documents are an exception
- **Components**: PascalCase with `ComponentNameProps` interface pattern
- **Styling**: Tailwind utility classes only — no inline styles
- **Variants**: Define a `const variantStyles = {}` object, index into it for conditional classes
- **No manual memoization**: React Compiler handles it — avoid unnecessary `useMemo`/`useCallback`

## Reference Docs

Detailed project rules live in `.claude/rules`.

- `.claude/rules/architecture.md` — FSD 디렉터리 구조와 레이어 import 규칙
- `.claude/rules/code-style.md` — TypeScript/React 네이밍 및 코드 스타일 규칙
- `.claude/rules/domain-patterns.md` — feature/entity/shared/widgets 구현 패턴
- `.claude/rules/global-patterns.md` — auth, provider, theme, routes, API instance 같은 전역 패턴
- `.claude/rules/testing.md` — 현재 프로젝트에 적용 가능한 테스트 작성 기준
- `.claude/rules/commit-convention.md` — 브랜치명, 커밋 타입, 메시지 규칙
- `.claude/rules/api-convention.md` — API client, query layer, 서버 상태 관리 규칙
- `.claude/rules/component-convention.md` — 컴포넌트/props/variant/styling 규칙
