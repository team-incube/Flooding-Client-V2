# Code Style

## 언어와 기본 원칙

- 모든 응답과 작업 설명은 한국어를 사용한다.
- TypeScript `strict` 기준을 깨는 우회는 금지한다.
- 파일명은 kebab-case를 사용한다.
- 불필요한 축약어보다 의미가 분명한 이름을 우선한다.

## 컴포넌트와 타입 네이밍

- React 컴포넌트는 PascalCase를 사용한다.
- props 인터페이스는 `ComponentNameProps` 형식을 우선한다.
- 타입과 인터페이스 이름은 역할이 드러나야 한다.
- hook은 반드시 `useXxx` 형식을 사용한다.
- 상수는 의미 단위로 묶고, 변경 가능성이 없는 값만 `const`로 선언한다.

## React 작성 규칙

- React Compiler를 사용하므로 `useMemo`, `useCallback`은 꼭 필요한 경우에만 쓴다.
- 파생 상태를 또 다른 `useState`로 복제하지 않는다.
- JSX 내부에 긴 계산 로직을 넣지 않는다.
- 이벤트 핸들러 이름은 `handleXxx` 형식을 사용한다.

## 함수 작성 규칙

- 함수명은 반환값이나 부작용이 드러나야 한다.
- 재사용 가능한 순수 함수는 컴포넌트 밖으로 분리한다.
- 불리언 반환 함수는 `is`, `has`, `can`, `should` 접두어를 사용한다.
- 컬렉션 변환 함수는 `get`, `group`, `filter`, `map`처럼 결과가 드러나는 이름을 사용한다.

## import 규칙

- 절대 경로 import는 `@/` alias를 사용한다.
- 타입 전용 import는 가능한 경우 `import type`을 사용한다.
- 사용하지 않는 import와 dead code를 남기지 않는다.
