import axios, { HttpStatusCode } from "axios";
import { NextRequest, NextResponse } from "next/server";
import { LONG_API_TIMEOUT_MS, serverInstance } from "@/shared/api/instance";
import { COOKIE_CONFIG } from "@/shared/config/cookie";

export async function POST(request: NextRequest) {
  const { code } = await request.json();

  try {
    const signinUrl = `${process.env.NEXT_PUBLIC_BASE_URL!}/auth/signin`;
    const signinBody = {
      authCode: code,
      redirectUri: process.env.NEXT_PUBLIC_DG_REDIRECT_URL!,
    };

    const response = await serverInstance.post(signinUrl, signinBody, {
      timeout: LONG_API_TIMEOUT_MS,
    });

    const refreshToken = response.data.data?.refreshToken;

    const res = NextResponse.json(response.data, { status: response.status });

    if (refreshToken) {
      res.cookies.set(
        COOKIE_CONFIG.refreshToken.name,
        refreshToken,
        COOKIE_CONFIG.refreshToken.options,
      );
    }

    return res;
  } catch (error) {
    const fallbackBody = { error: "Internal Server Error" };

    if (axios.isAxiosError(error) && error.response) {
      const { data, status } = error.response;
      const body = data ?? fallbackBody;

      if (
        status === HttpStatusCode.BadRequest ||
        status === HttpStatusCode.Unauthorized ||
        status === HttpStatusCode.InternalServerError
      ) {
        return NextResponse.json(body, { status });
      }
    }

    return NextResponse.json(fallbackBody, {
      status: HttpStatusCode.InternalServerError,
    });
  }
}
