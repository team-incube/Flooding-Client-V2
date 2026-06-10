import { NextRequest, NextResponse } from "next/server";
import { COOKIE_CONFIG } from "@/shared/config/cookie";
import { PUBLIC_ROUTES } from "@/shared/config/routes";

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|api|images|video|files).*)",
  ],
};

function isSafeRedirectPath(path: string): boolean {
  return path.startsWith("/") && !path.startsWith("//") && path !== "/signin";
}

export function proxy(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;
  const refreshToken = request.cookies.get(
    COOKIE_CONFIG.refreshToken.name,
  )?.value;

  if (pathname === "/signin" && refreshToken) {
    const redirectTo = searchParams.get("redirectTo");

    if (redirectTo && isSafeRedirectPath(redirectTo)) {
      return NextResponse.redirect(new URL(redirectTo, request.url));
    }

    return NextResponse.redirect(new URL("/", request.url));
  }

  if (!PUBLIC_ROUTES.some((page) => page === pathname) && !refreshToken) {
    const signinUrl = new URL("/signin", request.url);
    const intendedPath = request.nextUrl.pathname + request.nextUrl.search;

    signinUrl.searchParams.set("redirectTo", intendedPath);

    return NextResponse.redirect(signinUrl);
  }

  return NextResponse.next();
}
