import axios from "axios";
import { NextRequest, NextResponse } from "next/server";
import { instance } from "@/shared/api/instance";

export async function GET(request: NextRequest) {
  const authorization = request.headers.get("Authorization");

  if (!authorization) {
    return NextResponse.json({ error: "인증 토큰 없음" }, { status: 401 });
  }

  try {
    const { data: user } = await instance.get(
      process.env.DATAGSM_USERINFO_URL!,
      {
        headers: { Authorization: authorization },
      },
    );
    return NextResponse.json(user);
  } catch (error) {
    const status = axios.isAxiosError(error)
      ? (error.response?.status ?? 500)
      : 500;
    return NextResponse.json({ error: "유저 정보 조회 실패" }, { status });
  }
}
