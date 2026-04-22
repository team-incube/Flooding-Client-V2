import axios, { HttpStatusCode } from "axios";
import { NextRequest, NextResponse } from "next/server";
import { instance } from "@/shared/api/instance";

export async function GET(request: NextRequest) {
  const authorization = request.headers.get("Authorization");

  if (!authorization) {
    return NextResponse.json(
      { error: "인증 토큰 없음" },
      { status: HttpStatusCode.Unauthorized },
    );
  }

  try {
    const { data: user } = await instance.get(
      process.env.DATAGSM_USERINFO_URL!,
      {
        headers: { Authorization: authorization },
      },
    );
    return NextResponse.json(user.data);
  } catch (error) {
    const fallbackBody = { error: "유저 정보 조회 실패" };

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
