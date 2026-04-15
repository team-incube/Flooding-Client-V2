# API Convention

## 공용 원칙

- HTTP 클라이언트는 `src/shared/api/instance.ts`의 Axios 인스턴스를 사용한다.
- 임의의 `fetch`와 별도 Axios 인스턴스를 새로 만들지 않는다.
- 공용 React Query 설정은 `src/shared/api/queryClient.ts`를 기준으로 한다.

## 배치 규칙

- 도메인 API 호출 함수는 `entities/[domain]/api`에 둔다.
- React Query `queryOptions` 정의도 같은 도메인 `api` 폴더에서 관리한다.
- 실제 서버 호출 함수와 query option 정의는 분리할 수 있지만 같은 도메인 맥락에 둔다.

## Query 규칙

- query key는 도메인 이름부터 시작한다.
- 예:
  - `['dormitory', 'music']`
  - `['dormitory', 'massage']`
- query key는 상수처럼 일관된 구조를 유지한다.

## Mutation 규칙

- mutation 함수는 도메인 객체 형태로 묶어 export한다.
- body 타입은 `model/[domain]` 같은 도메인 타입 파일에서 가져온다.
- API 경로 문자열은 같은 도메인 안에서 일관된 네이밍을 유지한다.

## 인증 규칙

- access token 주입과 401 재시도는 Axios interceptor에 맡긴다.
- 개별 호출부에서 중복으로 토큰 주입 로직을 작성하지 않는다.
