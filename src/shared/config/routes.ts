export const ROUTES = [
  { href: "/", label: "홈" },
  { href: "/dormitory", label: "기숙사" },
  { href: "/school", label: "학교" },
  { href: "/club", label: "동아리" },
] as const;

export const PATH_LABEL_MAP: Record<string, string> = Object.fromEntries(
  ROUTES.map(({ href, label }) => [href, label])
);
