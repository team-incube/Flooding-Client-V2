# Domain Patterns

## Purpose

- This document defines the implementation patterns used in `features`, `entities`, `widgets`, and `shared`.

## entities

- Place domain types, mock data, domain APIs, and domain-specific UI fragments here.
- Place data transformation functions tied to a domain in `entities/[domain]/lib`.
- Examples:
  - `src/entities/dormitory/api`
  - `src/entities/club/model`
  - `src/entities/music/lib`

## features

- Place state and UI centered around user actions here.
- Place custom hooks, reducers, and feature-specific pure functions in `features/[feature]/model` or `lib`.
- Handle form state, selection state, and modal state used directly by the screen in the feature layer.

## widgets

- Place composition-oriented UI used directly by pages here.
- Widgets should only combine multiple feature/entity/shared modules and must not define new domain policies on their own.

## shared

- Only place globally reusable API infrastructure, UI, configuration, and shared types here.
- Do not move logic that is valid for only one domain into `shared`.

## UI And Logic Separation

- Keep JSX rendering and simple click-handler wiring in the UI layer.
- Extract reusable calculation, sorting, filtering, and comparison logic into `lib`.
- Place reducers and custom hooks in `model`.
- Keep server-state usage in feature/widget UI, while placing query option definitions and API call functions in lower layers.
