export const ROUTES = [
  { href: "/", label: "홈" },
  { href: "/dormitory", label: "기숙사" },
  { href: "/school", label: "학교" },
  { href: "/club", label: "동아리" },
  { href: "/students", label: "학생관리" },
] as const;

/** 인증 없이 접근 가능한 페이지 (proxy 보호 예외) */
export const PUBLIC_ROUTES = ["/signin", "/callback"] as const;

/** 인증 관련 라우트 핸들러 경로 */
export const AUTH_ROUTES = {
  callback: "/api/auth/callback",
  refresh: "/api/auth/refresh",
  signout: "/api/auth/signout",
} as const;
