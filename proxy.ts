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

/**
 * 링크 미리보기·검색 색인을 위한 소셜/SEO 크롤러 User-Agent.
 * 이들은 항상 비인증으로 접근하므로 인증 리다이렉트 없이 통과시켜
 * 메타태그와 OG 이미지를 읽게 한다. (페이지 데이터는 클라이언트에서
 * 인증 후 fetch되므로 셸만 노출된다.)
 */
const CRAWLER_USER_AGENT_PATTERN =
  /facebookexternalhit|facebot|twitterbot|slackbot|slack-imgproxy|discordbot|kakaotalk-scrap|daumoa|telegrambot|whatsapp|linkedinbot|redditbot|pinterest|applebot|googlebot|bingbot|yeti|naverbot|line-podcast|skypeuripreview|embedly|google-inspectiontool/i;

function isCrawler(userAgent: string | null): boolean {
  return userAgent ? CRAWLER_USER_AGENT_PATTERN.test(userAgent) : false;
}

export function proxy(request: NextRequest) {
  if (isCrawler(request.headers.get("user-agent"))) {
    return NextResponse.next();
  }

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
