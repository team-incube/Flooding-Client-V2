# Code Style

## Language And Core Principles

- Use Korean for all responses and work summaries.
- Do not use workarounds that break TypeScript `strict`.
- Use kebab-case for directory names.
- Follow role-based naming rules for file names.
- Use PascalCase for React component files.
- Do not use kebab-case for non-component files.
- Use lowerCamelCase for multi-word non-component files.
- Single-word domain files may use lowercase.
- Do not use PascalCase for new non-component files.
- Markdown documents are an exception to the file naming rules above.
- Prefer clear, descriptive names over unnecessary abbreviations.

## Component And Type Naming

- Use PascalCase for React components.
- Prefer PascalCase for React component files as well.
- Prefer the `ComponentNameProps` pattern for props interfaces.
- Type and interface names should clearly show their role.
- Hooks must use the `useXxx` pattern.
- Group constants by meaning and declare only immutable values with `const`.

## React Rules

- Because the project uses React Compiler, only use `useMemo` and `useCallback` when truly necessary.
- Do not duplicate derived state into another `useState`.
- Do not place long calculation logic inside JSX.
- Do not put long inline handlers or async functions directly in JSX props; extract them to named `handleXxx` functions.
- Use the `handleXxx` pattern for event handler names.
- Do not bypass ESLint rules with disable comments unless there is no reasonable structural fix and the reason is documented.

## Function Rules

- Function names should reveal their return value or side effect.
- Extract reusable pure functions outside the component.
- Use `is`, `has`, `can`, or `should` prefixes for boolean-returning functions.
- Use result-oriented names such as `get`, `group`, `filter`, or `map` for collection transformation functions.

## Import Rules

- Use the `@/` alias for absolute imports.
- Use `import type` for type-only imports whenever possible.
- Do not leave unused imports or dead code behind.
