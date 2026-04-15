# Domain Patterns

## 목적

- 이 문서는 `features`, `entities`, `widgets`, `shared`에서 어떤 구현 패턴을 사용하는지 정의한다.

## entities

- 도메인 타입, mock 데이터, 도메인 API, 도메인별 UI 조각을 둔다.
- 도메인에 종속된 데이터 변환 함수는 `entities/[domain]/lib`에 둔다.
- 예:
  - `src/entities/dormitory/api`
  - `src/entities/club/model`
  - `src/entities/music/lib`

## features

- 사용자 액션 중심의 상태와 UI를 둔다.
- custom hook, reducer, feature 전용 순수 함수는 `features/[feature]/model` 또는 `lib`에 둔다.
- 화면에서 직접 사용하는 폼 상태, 선택 상태, 모달 상태는 feature 레이어에서 다룬다.

## widgets

- 페이지에서 바로 사용하는 조합형 UI를 둔다.
- 여러 feature/entity/shared를 엮는 역할만 하며, 도메인 정책 자체를 새로 만들지 않는다.

## shared

- 전역 재사용 가능한 API 인프라, UI, 설정, 공용 타입만 둔다.
- 특정 도메인에만 유효한 로직은 `shared`로 올리지 않는다.

## UI와 로직 분리 기준

- JSX 렌더링, 단순 클릭 핸들러 연결은 UI에 둔다.
- 재사용 가능한 계산, 정렬, 필터링, 비교 로직은 `lib`로 분리한다.
- reducer와 custom hook은 `model`에 둔다.
- 서버 상태 사용 지점은 feature/widget UI에 두되, query option 정의와 API 호출 함수는 하위 레이어에 둔다.
