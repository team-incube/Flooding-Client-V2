# Architecture

## 목적

- 이 문서는 Flooding-Client-V2의 디렉터리 구조와 레이어 책임을 정의한다.
- 모든 구현은 현재 저장소의 FSD 구조를 기준으로 배치한다.

## 디렉터리 구조

```text
app/
src/
  entities/
  features/
  shared/
  widgets/
```

- `app`
  - Next.js App Router 엔트리, 레이아웃, 페이지, 라우트 핸들러만 둔다.
- `widgets`
  - 여러 feature/entity/shared를 조합한 화면 단위 조립 컴포넌트를 둔다.
- `features`
  - 사용자 액션 중심의 기능 단위를 둔다.
- `entities`
  - 도메인 모델, 도메인별 타입, API, UI 조각, 데이터 변환 함수를 둔다.
- `shared`
  - 전역 재사용 코드만 둔다.

## 레이어 import 규칙

- 허용 방향: `app → widgets → features → entities → shared`
- 같은 레이어 내부 import는 허용한다.
- 상위 레이어를 역참조하는 import는 금지한다.
- `@/` alias는 항상 `src/` 기준으로만 사용한다.

## 배치 규칙

- 페이지 라우팅과 `route.ts`는 `app`에 둔다.
- 여러 기능을 묶는 카드, 섹션, 사이드바는 `widgets`에 둔다.
- 사용자 상호작용을 처리하는 hook, 상태, 기능 UI는 `features`에 둔다.
- 도메인 모델 타입, mock, domain-specific API는 `entities`에 둔다.
- Axios 인스턴스, QueryClient, 공용 UI, 공용 설정은 `shared`에 둔다.

## 금지 사항

- `shared`가 `entities`, `features`, `widgets`를 import하면 안 된다.
- 범용성이 없는 feature 전용 로직을 `shared`로 올리면 안 된다.
- 하나의 파일에 관련 없는 여러 책임을 섞지 않는다.
