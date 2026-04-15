# Global Patterns

## Providers

- 전역 provider는 `app/providers.tsx`에 둔다.
- 현재 전역 provider 구성은 다음 기준을 따른다.
  - `MSWProvider`
  - `QueryClientProvider`
  - `OAuthProvider`
  - `ReactQueryDevtools`

## 인증 패턴

- 인증 관련 라우트 핸들러는 `app/api/auth/*/route.ts`에 둔다.
- 현재 인증 흐름은 access token은 `sessionStorage`, refresh token은 httpOnly cookie를 사용한다.
- 인증 갱신은 `src/shared/api/instance.ts`의 Axios interceptor를 기준으로 동작한다.
- 토큰이 만료되고 refresh에도 실패하면 세션을 정리하고 `/signin`으로 이동한다.

## API 인프라

- 공용 Axios 인스턴스는 `src/shared/api/instance.ts`를 사용한다.
- 공용 QueryClient 설정은 `src/shared/api/queryClient.ts`를 사용한다.
- 도메인별 query option과 mutation 함수는 각 entity의 `api` 폴더에 둔다.

## 라우트와 전역 설정

- 네비게이션 라우트 정보는 `src/shared/config/routes.ts`를 기준으로 관리한다.
- 여러 UI에서 공유하는 라벨과 경로 매핑은 이 파일을 재사용한다.

## 테마

- 전역 색상과 타이포 토큰은 `app/globals.css`의 CSS 변수 기준으로 관리한다.
- 다크 모드는 `<html>`의 `.dark`와 `.light` 클래스로 제어한다.
- 토큰을 우회하는 하드코딩 스타일 추가는 지양한다.
