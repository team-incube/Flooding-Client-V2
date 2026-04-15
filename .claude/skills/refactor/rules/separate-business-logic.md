# Rule: Separate Business Logic from UI

## Why

When business logic lives inside JSX components, it becomes impossible to write Vitest unit tests.
The goal is: **UI only renders data. Logic only processes data.**

---

## Extraction Triggers

Extract code out of a component when you see any of these patterns:

- Inline `if/else` calculations or `reduce`/`filter` pipelines
- `useReducer` with its types and initial state defined inside the component
- Multiple `useState` values that feed derived calculations (e.g. `isFull`, `canSubmit`, `maxPersonnel`)
- A function that takes no React state as input and returns a plain value

---

## FSD Placement Rules

| Code Type | Location |
|-----------|----------|
| Generic pure function (reusable across domains) | `shared/lib/<functionName>.ts` |
| Feature-level pure function | `features/[domain]/lib/<functionName>.ts` |
| Feature-level state machine (reducer + types + initial state) | `features/[domain]/model/<domain>Reducer.ts` |
| Feature-level custom hook | `features/[domain]/model/use<Name>.ts` |
| Entity-level data transformation | `entities/[domain]/lib/<functionName>.ts` |

Layer import rule: `widgets → features → entities → shared` (downward only)

---

## Single Responsibility Principle (SRP)

**One function per file.**

- Pure function files: filename = function name
  - ✅ `isPeriodStarted.ts`, `getMaxPersonnel.ts`, `randomSongs.ts`
  - ❌ `utils.ts`, `helpers.ts`, `homebase.ts` (multiple functions)
- Exception: a reducer, its action types, and initial state are a single **state machine** — keep them in one file
  - ✅ `studyFilterReducer.ts` (contains `FilterState`, `FilterAction`, `initialFilterState`, `filterReducer`)
- `utils.ts` is **banned** — always name the file after its responsibility

---

## What Stays in UI Components

Do **not** extract these — they belong in the UI layer:

- `useQuery`, `useMutation`, `useQueryClient` — server state management belongs at the feature UI layer
- `renderXxx()` switch blocks — pure JSX branching stays in the component
- All JSX markup

---

## Execution Checklist

```
[ ] Identify all logic targets inside the component (calculations, reducers, derived state)
[ ] Determine file location using the FSD placement table above
[ ] Create one file per function — verify SRP
[ ] Delete the old aggregated file (utils.ts, etc.) after splitting
[ ] Update all import paths in consumers
[ ] Run: npm run build — confirm zero TypeScript errors
[ ] Run: npm run lint — confirm ESLint passes
```

---

## Real Examples from This Codebase

| Extracted To | From | Function |
|---|---|---|
| `shared/lib/toggleFilter.ts` | `SelfStudySection.tsx` | `toggleFilter<T>()` |
| `features/self-study/model/studyFilterReducer.ts` | `SelfStudySection.tsx` | `FilterState`, `filterReducer` |
| `features/self-study/model/useStudyFilter.ts` | `SelfStudySection.tsx` | `useStudyFilter()` |
| `features/homebase/lib/isPeriodStarted.ts` | `HomebaseCard.tsx` | `isPeriodStarted()` |
| `features/homebase/lib/getMaxPersonnel.ts` | `HomebaseCard.tsx` | `getMaxPersonnel()` |
| `features/homebase/model/useHomebaseForm.ts` | `HomebaseCard.tsx` | `useHomebaseForm()` |
| `features/homebase/model/constants.ts` | `HomebaseCard.tsx` | `FLOORS`, `PERIODS`, `TABLE_MAX_PERSONNEL` |
| `entities/music/lib/randomSongs.ts` | `MusicRecommendModal.tsx` | `randomSongs()` |
| `features/wake-up-music/model/useMusicRecommendSelection.ts` | `MusicRecommendModal.tsx` | `useMusicRecommendSelection()` |
| `entities/club/lib/groupMembersByGrade.ts` | `ClubMemberList.tsx` | `groupMembersByGrade()` |
| `entities/club/lib/getSortedGrades.ts` | `ClubMemberList.tsx` | `getSortedGrades()` |
