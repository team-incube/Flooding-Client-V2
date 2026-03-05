// import { NextRequest, NextResponse } from "next/server";
// import type { UserRole } from "@/entities/user/model/user";

// const publicPages: string[] = ["/signin", "/oauth/callback"];

// const roleProtectedPaths: { path: string; roles: UserRole[] }[] = [
//   { path: "/dormitory/manage", roles: ["DORMITORY_MANAGER"] },
//   { path: "/school/manage", roles: ["STUDENT_COUNCIL", "DORMITORY_MANAGER"] },
//   { path: "/club/manage", roles: ["STUDENT_COUNCIL", "DORMITORY_MANAGER"] },
// ];

// export const config = {
//   matcher: [
//     "/((?!_next/static|_next/image|favicon.ico|api|images|video|files).*)",
//   ],
// };

// export function proxy(request: NextRequest) {
//   const { pathname, searchParams } = request.nextUrl;

//   const accessToken = request.cookies.get("accessToken")?.value;
//   const refreshToken = request.cookies.get("refreshToken")?.value;
//   const role = (
//     ["GENERAL_STUDENT", "STUDENT_COUNCIL", "DORMITORY_MANAGER"] as const
//   ).find((r) => r === request.cookies.get("role")?.value);

//   if (pathname === "/signin" && accessToken && refreshToken) {
//     const redirectTo = searchParams.get("redirectTo");
//     if (redirectTo && redirectTo.startsWith("/") && redirectTo !== "/signin") {
//       return NextResponse.redirect(new URL(redirectTo, request.url));
//     }
//     return NextResponse.redirect(new URL("/", request.url));
//   }

//   const isProtectedRoute = !publicPages.includes(pathname);
//   if (isProtectedRoute && !accessToken && !refreshToken) {
//     const signinUrl = new URL("/signin", request.url);
//     const intended = request.nextUrl.pathname + request.nextUrl.search;
//     signinUrl.searchParams.set("redirectTo", intended);
//     return NextResponse.redirect(signinUrl);
//   }

//   const matchedRoleRule = roleProtectedPaths.find(({ path }) =>
//     pathname.startsWith(path),
//   );
//   if (matchedRoleRule && (!role || !matchedRoleRule.roles.includes(role))) {
//     return NextResponse.redirect(new URL("/", request.url));
//   }

//   return NextResponse.next();
// }

//주석으로 미들웨어 전체를 감싸면 빌드 오류가 생겨서 빈 미들웨어 함수를 추가 하였습니다.
import { NextResponse } from "next/server";
export function middleware() {
  return NextResponse.next();
}
