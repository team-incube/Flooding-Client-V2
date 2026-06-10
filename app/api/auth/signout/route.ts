import { NextResponse } from "next/server";
import { COOKIE_CONFIG } from "@/shared/config/cookie";

export async function POST() {
  const response = NextResponse.json({ success: true });
  response.cookies.set(COOKIE_CONFIG.refreshToken.name, "", {
    ...COOKIE_CONFIG.refreshToken.options,
    maxAge: 0,
  });
  return response;
}
