# Auth Navigation Focus Outline Debug

## 배경

로그아웃 후 다시 로그인해 홈으로 돌아오면 화면 상단, 처음에는 헤더 근처에 파란색과 흰색 줄이 보이는 문제가 있었다. 이 줄은 시간이 지나도 자동으로 사라지지 않고, 사용자가 UI에 변화를 주는 행동을 했을 때 사라졌다.

프로덕션 환경과 시크릿 모드에서도 동일하게 재현되었고, 개발 도구나 React Query Devtools에만 의존한 문제는 아니었다.

## 재현 흐름

1. 로그인된 상태에서 로그아웃한다.
2. 다시 로그인한다.
3. OAuth callback 처리 후 홈(`/`)으로 이동한다.
4. 홈 화면 상단에 파란색과 흰색 줄이 보인다.
5. 이후 사용자가 UI를 조작하면 줄이 사라진다.

## 초기 조사

처음에는 헤더 영역에 보였기 때문에 다음 가능성을 확인했다.

- `DarkModeToggle` 버튼의 focus outline
- `ReactQueryDevtools` 조건부 렌더링
- 전역 focus CSS
- 헤더의 선택/포커스 스타일
- callback 이후 라우팅 방식

일부 실험에서 `window.location.replace("/")`로 전체 문서 내비게이션을 사용하면 증상이 사라졌다. 하지만 이 방식은 App Router의 soft navigation을 회피하는 해결책이었고, 근본 원인을 설명하지 못했다.

## DataGSM OAuth 패턴 확인

참고 문서:

- <https://docs.datagsm.kr/oauth/examples/nextjs-spring-boot>

문서의 Next.js + Spring Boot 예시는 프론트엔드가 authorization code를 받고 백엔드에 전달한 뒤, 발급받은 JWT를 클라이언트 스토리지에서 관리하는 패턴이다.

현재 프로젝트도 API 요청 시 `sessionStorage.access_token`을 Authorization 헤더에 붙이는 client-token 중심 구조를 사용하고 있다. 따라서 `refresh_token` cookie는 access token 재발급용 보조 수단으로 두고, 라우트 접근 판정의 최종 기준으로 삼지 않는 방향이 더 일관적이라고 판단했다.

## 인증 구조 정리

기존 `proxy.ts`가 `refresh_token` cookie를 기준으로 페이지 접근과 redirect를 판정하면 다음 두 인증 기준이 섞일 수 있었다.

- 서버/Proxy 기준: `refresh_token` cookie
- 클라이언트/UI/API 기준: `sessionStorage.access_token`

이 불일치를 줄이기 위해 `proxy.ts`의 cookie 기반 페이지 redirect 판정을 제거하는 방향으로 정리했다. 인증 만료와 refresh 처리는 Axios interceptor에서 담당한다.

관련 흐름:

- 요청 전 `sessionStorage.access_token`을 Authorization 헤더에 추가
- 401 발생 시 `/api/auth/refresh`로 access token 재발급 시도
- refresh 실패 시 `sessionStorage` 토큰 제거 후 `/signin`으로 이동

## 추가 단서

헤더를 제거해 보니 줄이 사라지는 것이 아니라 `layout`의 `children` 영역 경계로 이동했다. 이로 인해 헤더 컴포넌트 자체의 border나 outline이 아니라, 현재 라우트 영역의 포커스 표시가 시각적으로 드러나는 문제로 범위가 좁혀졌다.

## 근본 원인

Next.js App Router는 `router.replace("/")` 같은 client-side navigation이 끝나면 접근성을 위해 새 라우트 세그먼트의 첫 DOM 요소에 프로그래밍 방식으로 `.focus()`를 호출한다. 이 자동 포커스로 인해 브라우저가 해당 요소의 기본 focus outline을 그려 화면 상단에 파란/흰 줄로 보인다.

이 동작은 Next.js의 알려진 이슈이고, 동일한 증상과 동일한 해결이 외부에서도 확인되어 있다.

- Next.js 본 이슈: <https://github.com/vercel/next.js/issues/49386>
- Dify의 동일 패턴 해결 PR: <https://github.com/langgenius/dify/pull/28937>

### 실제 코드 트레이스 (Next.js 16)

`node_modules/next/dist/client/components/layout-router.js:184`:

```js
// Set focus on the element
domNode.focus();
```

이 호출은 `if (focusAndScrollRef.apply)` 가드 안쪽에 있다 (같은 파일 109행).

`node_modules/next/dist/client/components/router-reducer/handle-mutable.js:44`:

```js
// All navigation requires scroll and focus management to trigger.
focusAndScrollRef: {
  apply: shouldScroll ? isNotUndefined(mutable?.scrollableSegments) ? true : state.focusAndScrollRef.apply : false,
  ...
}
```

즉 `shouldScroll === false` 이면 `apply === false` 가 되고, layout-router의 가드 때문에 **스크롤뿐 아니라 `.focus()` 호출 자체가 스킵된다.** Next.js는 스크롤과 포커스를 함께 묶어 처리하며, `router.push` / `router.replace`의 두 번째 인자 `{ scroll: false }` 가 그 둘을 동시에 끈다.

### 이전에 시도했던 가설의 정정

이전 메모에는 "라우트 컨테이너에 `tabindex='-1'` 이 자동으로 붙는다"고 적혀 있었으나, 실제 Next.js 16 클라이언트 번들에 `tabIndex` / `tabindex` 부여 코드는 존재하지 않는다 (`grep -rn 'tabIndex' node_modules/next/dist/client/` 결과 0건). Next.js는 `domNode.focus()`를 직접 호출만 할 뿐 속성을 부여하지 않는다. CSS의 `[tabindex="-1"]:focus { outline: none }` 류의 시도는 같은 이유로 이 시나리오에서 효과가 없거나 부정확하게 동작한다.

이 현상은 다음 관찰과 일치한다.

- `window.location.replace("/")`로 전체 문서 내비게이션을 하면 사라진다. (App Router auto-focus 자체가 발생하지 않으므로.)
- App Router soft navigation을 유지하면 나타난다.
- 헤더를 제거하면 줄이 `children` 영역 경계로 이동한다. (focus 대상이 헤더 안쪽이 아니라 라우트 세그먼트의 더 상위 요소이기 때문.)
- 사용자가 UI 조작으로 포커스 상태를 바꾸면 사라진다.

## 최종 수정

`app/callback/page.tsx`의 콜백 처리 후 홈 이동을 다음과 같이 바꿨다.

```tsx
// 변경 전
router.replace("/");

// 변경 후
router.replace("/", { scroll: false });
```

`{ scroll: false }` 옵션은 위에서 인용한 `handle-mutable.js`의 분기에 의해 `focusAndScrollRef.apply`를 false로 만들고, 결과적으로 layout-router의 `domNode.focus()` 호출 자체가 일어나지 않는다. 즉 outline의 원인이 되는 자동 포커스가 발생 자체를 막는 가장 정확한 해결이다.

callback 페이지는 작은 로딩 화면이고 `/` 진입은 새 마운트이므로, `scroll: false`로 인해 잃는 "최상단 자동 스크롤" 부작용은 실제 UX에 영향이 없다. 이 옵션은 단 한 호출에만 적용되므로 일반 SPA navigation의 스크롤/포커스 a11y 동작은 그대로 보존된다.

## 검증

다음 명령을 실행했고 통과했다.

```bash
npm run lint
npm run type-check
```

브라우저 수동 검증:

1. 로그아웃 후 재로그인하여 `/`로 진입한 직후 화면 상단에 파란/흰 줄이 보이지 않는지 확인한다.
2. 홈에서 Tab 키를 반복적으로 눌렀을 때 의도된 키보드 focus outline이 정상적으로 보이는지 확인한다. (이 변경은 callback 한 호출에만 영향이 있으므로 일반 키보드 a11y는 보존된다.)
3. 시크릿 모드와 다크/라이트 모드 모두에서 1~2를 동일하게 확인한다.

## 관련 파일

- `app/callback/page.tsx` — `router.replace("/", { scroll: false })`
- `app/(main)/layout.tsx`
- `src/widgets/adaptive-sidebar/ui/index.tsx`
- `src/shared/api/instance.ts`
- `proxy.ts`

