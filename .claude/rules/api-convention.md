# API Convention

## Shared Principles

- Use the Axios instances in `src/shared/api/instance.ts` as the HTTP clients.
- Use `instance` for client-side domain API calls and React Query calls.
- Use `serverInstance` for API calls made inside Next.js route handlers.
- `serverInstance` must not define a base URL; pass absolute URLs explicitly when a route handler calls an external or backend API.
- Do not introduce arbitrary `fetch` calls or separate Axios instances.
- Use `src/shared/api/queryClient.ts` as the source of shared React Query configuration.
- Use `HttpStatusCode` from `axios` for HTTP status comparisons instead of hard-coded numeric values.
- Narrow Axios errors with `axios.isAxiosError(error)` at the handling site and branch inline there.
- Do not create broad `unknown` structure-inspection helpers for one-off Axios error handling.

## Route Handler Rules

- Use `HttpStatusCode` from `axios` for route handler response statuses.
- Do not hard-code numeric HTTP status values such as `500` in `NextResponse.json` options.

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
