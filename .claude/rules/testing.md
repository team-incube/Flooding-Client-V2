# Testing

## Current Baseline

- There are currently no test files in this repository.
- Define new testing rules only at a level that can be applied to the current codebase immediately.

## Priorities

- Add unit tests for extracted pure functions first.
- Reducers, custom hooks, and data transformation functions are the next priority.
- Give lower testing priority to simple UI that only handles visual presentation.

## Test Targets

- Filtering, sorting, comparison, and derived-state calculation functions
- Reducer state transitions
- Query option composition logic
- Utility functions with many branches, such as authentication or routing logic

## Naming

- Use `*.test.ts` or `*.test.tsx` based on the target file name.
- Use the target module name for `describe`, and write test titles as expected behavior in Korean or clear English.

## Principles

- Keep mocks minimal and limited to what is necessary.
- Handle external API communication with mocks or MSW instead of the real network.
- Verify inputs, outputs, and user-observable behavior rather than implementation details.
