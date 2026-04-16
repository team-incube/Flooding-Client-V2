# Global Patterns

## Providers

- Place global providers in `app/providers.tsx`.
- The current global provider composition follows this structure:
  - `MSWProvider`
  - `QueryClientProvider`
  - `OAuthProvider`
  - `ReactQueryDevtools`

## Authentication Pattern

- Place authentication-related route handlers in `app/api/auth/*/route.ts`.
- The current authentication flow uses `sessionStorage` for the access token and an httpOnly cookie for the refresh token.
- Token refresh is handled by the Axios interceptor in `src/shared/api/instance.ts`.
- If the token expires and refresh also fails, clear the session and redirect to `/signin`.

## API Infrastructure

- Use `src/shared/api/instance.ts` for the shared Axios instance.
- Use `src/shared/api/queryClient.ts` for shared QueryClient configuration.
- Place domain-specific query options and mutation functions in each entity's `api` directory.

## Routes And Global Configuration

- Manage navigation route information in `src/shared/config/routes.ts`.
- Reuse this file for labels and path mappings shared across multiple UIs.

## Theme

- Manage global color and typography tokens with the CSS variables defined in `app/globals.css`.
- Control dark mode with the `.dark` and `.light` classes on `<html>`.
- Avoid adding hard-coded styles that bypass the design tokens.
