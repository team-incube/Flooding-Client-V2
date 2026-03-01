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

- **File names**: kebab-case (e.g., `profile-card.tsx`)
- **Components**: PascalCase with `ComponentNameProps` interface pattern
- **Styling**: Tailwind utility classes only — no inline styles
- **Variants**: Define a `const variantStyles = {}` object, index into it for conditional classes
- **No manual memoization**: React Compiler handles it — avoid unnecessary `useMemo`/`useCallback`
