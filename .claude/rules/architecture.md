# Architecture

## Purpose

- This document defines the directory structure and layer responsibilities of Flooding-Client-V2.
- Place all implementations according to the current repository's FSD structure.

## Directory Structure

```text
app/
src/
  entities/
  features/
  shared/
  widgets/
```

- `app`
  - Only place Next.js App Router entries, layouts, pages, and route handlers here.
- `widgets`
  - Place screen-level composition components that combine multiple feature/entity/shared modules.
- `features`
  - Place feature units centered around user actions.
- `entities`
  - Place domain models, domain-specific types, APIs, UI fragments, and data transformation functions.
- `shared`
  - Only place globally reusable code here.

## Layer Import Rules

- Allowed direction: `app → widgets → features → entities → shared`
- Imports within the same layer are allowed.
- Imports that reference an upper layer are forbidden.
- Always use the `@/` alias relative to `src/`.

## Placement Rules

- Put page routing and `route.ts` files in `app`.
- Put cards, sections, and sidebars that combine multiple features in `widgets`.
- Put hooks, state, and feature UI that handle user interaction in `features`.
- Put domain model types, mocks, and domain-specific APIs in `entities`.
- Put the Axios instance, QueryClient, shared UI, and shared configuration in `shared`.

## Prohibited

- `shared` must not import from `entities`, `features`, or `widgets`.
- Do not move feature-specific logic without general reuse value into `shared`.
- Do not mix unrelated responsibilities in a single file.
