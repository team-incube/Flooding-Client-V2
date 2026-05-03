import axios, { HttpStatusCode } from "axios";
import { NextRequest, NextResponse } from "next/server";
import { serverInstance } from "@/shared/api/instance";

export async function POST(request: NextRequest) {
  const { code } = await request.json();

  try {
    const signinUrl = `${process.env.NEXT_PUBLIC_BASE_URL!}/auth/signin`;
    const signinBody = {
      authCode: code,
      redirectUri: process.env.NEXT_PUBLIC_DG_REDIRECT_URL!,
    };

    const response = await serverInstance.post(signinUrl, signinBody);

    const refreshToken = response.data.data?.refreshToken;

    const res = NextResponse.json(response.data, { status: response.status });

    if (refreshToken) {
      res.cookies.set("refresh_token", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/api/auth",
        maxAge: 60 * 60 * 24 * 14,
      });
    }

    return res;
  } catch (error) {
    const fallbackBody = { error: "Internal Server Error" };

    if (axios.isAxiosError(error) && error.response) {
      const { data, status } = error.response;
      const body = data ?? fallbackBody;

      if (status === HttpStatusCode.BadRequest) {
        return NextResponse.json(body, { status });
      }

      if (status === HttpStatusCode.Unauthorized) {
        return NextResponse.json(body, { status });
      }

      if (status === HttpStatusCode.InternalServerError) {
        return NextResponse.json(body, { status });
      }
    }

    return NextResponse.json(fallbackBody, {
      status: HttpStatusCode.InternalServerError,
    });
  }
}
