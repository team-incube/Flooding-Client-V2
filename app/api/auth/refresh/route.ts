import axios, { HttpStatusCode } from "axios";
import { NextRequest, NextResponse } from "next/server";
import { serverInstance } from "@/shared/api/instance";

export async function POST(request: NextRequest) {
  const refreshToken = request.cookies.get("refresh_token")?.value;

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

    return NextResponse.json(response.data, {
      status: response.status,
    });
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
