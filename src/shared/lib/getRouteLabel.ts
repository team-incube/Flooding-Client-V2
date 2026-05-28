import { ROUTES } from "../config/routes";

export function getRouteLabel(pathname: string): string {
  const route = ROUTES.find(
    ({ href }) =>
      pathname === href || (href !== "/" && pathname.startsWith(`${href}/`)),
  );
  return route?.label ?? pathname;
}
