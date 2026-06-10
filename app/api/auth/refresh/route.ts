import axios, { HttpStatusCode } from "axios";
import { NextRequest, NextResponse } from "next/server";
import { serverInstance } from "@/shared/api/instance";
import { COOKIE_CONFIG } from "@/shared/config/cookie";

export async function POST(request: NextRequest) {
  const refreshToken = request.cookies.get(
    COOKIE_CONFIG.refreshToken.name,
  )?.value;

  if (!refreshToken) {
    return NextResponse.json(
      { error: "refresh_token 없음" },
      { status: HttpStatusCode.Unauthorized },
    );
  }

  try {
    const reissueUrl = process.env.NEXT_PUBLIC_BASE_URL! + "/auth/reissue";
    const reissueBody = { refreshToken };

    const response = await serverInstance.post(reissueUrl, reissueBody);

    const newRefreshToken = response.data.data?.refreshToken;

    const res = NextResponse.json(response.data, { status: response.status });

    if (newRefreshToken) {
      res.cookies.set(
        COOKIE_CONFIG.refreshToken.name,
        newRefreshToken,
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
        status === HttpStatusCode.Unauthorized
      ) {
        const res = NextResponse.json(body, { status });
        res.cookies.set(COOKIE_CONFIG.refreshToken.name, "", {
          ...COOKIE_CONFIG.refreshToken.options,
          maxAge: 0,
        });
        return res;
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
