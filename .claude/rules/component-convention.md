# Component Convention

## 기본 규칙

- 폴더명은 kebab-case를 사용한다.
- 컴포넌트 파일명은 역할과 프로젝트 관례에 맞게 작성하며, kebab-case를 강제하지 않는다.
- 컴포넌트는 PascalCase로 선언한다.
- props 타입은 `ComponentNameProps` 형식을 우선한다.

## 스타일링

- 스타일은 Tailwind utility class만 사용한다.
- inline style은 금지한다.
- 색상, 배경, 타이포는 `app/globals.css`의 토큰 유틸리티를 우선 사용한다.

## variants

- variant가 있는 컴포넌트는 `const variantStyles = {}` 패턴을 사용한다.
- size가 있으면 `sizeStyles`처럼 별도 객체로 분리한다.
- 공통 클래스는 `baseStyles`로 분리할 수 있다.

## 상태와 렌더링

- 컴포넌트는 렌더링과 상호작용 연결에 집중한다.
- 길거나 재사용 가능한 계산은 컴포넌트 밖으로 분리한다.
- 조건부 렌더링은 JSX에서 표현하되, 복잡한 파생 로직은 hook이나 lib로 뺀다.

## 폼 컴포넌트

- 입력 변경 핸들러는 `handleChange`, `handleSubmit`처럼 역할이 드러나게 작성한다.
- 파생 가능 여부 값은 `canSubmit`, `isChanged`처럼 읽히는 이름을 사용한다.
