# API Convention

## Shared Principles

- Use the Axios instance in `src/shared/api/instance.ts` as the HTTP client.
- Do not introduce arbitrary `fetch` calls or separate Axios instances.
- Use `src/shared/api/queryClient.ts` as the source of shared React Query configuration.

## Placement Rules

- Place domain API call functions in `entities/[domain]/api`.
- Manage React Query `queryOptions` definitions in the same domain `api` directory.
- Actual server call functions and query option definitions may be separated, but keep them in the same domain context.

## Query Rules

- Query keys must start with the domain name.
- Examples:
  - `['dormitory', 'music']`
  - `['dormitory', 'massage']`
- Keep query keys structurally consistent like constants.

## Mutation Rules

- Export mutation functions grouped as domain objects.
- Import body types from domain type files such as `model/[domain]`.
- Keep API path strings consistently named within the same domain.

## Authentication Rules

- Let the Axios interceptor handle access-token injection and 401 retries.
- Do not duplicate token injection logic in individual call sites.
