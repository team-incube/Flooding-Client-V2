import axios from "axios";
import { NextRequest, NextResponse } from "next/server";
import { instance } from "@/shared/api/instance";

export async function POST(request: NextRequest) {
  const { code, codeVerifier } = await request.json();

  let accessToken: string;

  try {
    const { data: body } = await instance.post(process.env.DATAGSM_TOKEN_URL!, {
      grant_type: "authorization_code",
      code,
      client_id: process.env.NEXT_PUBLIC_DG_CLIENT_ID,
      redirect_uri: process.env.NEXT_PUBLIC_DG_REDIRECT_URL,
      code_verifier: codeVerifier,
    });
    accessToken = body.data.access_token;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return NextResponse.json({ error: "토큰 교환 실패" }, { status: 400 });
    }
    return NextResponse.json({ error: "알 수 없는 오류" }, { status: 500 });
  }

  try {
    const { data: user } = await instance.get(
      process.env.DATAGSM_USERINFO_URL!,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      },
    );
    return NextResponse.json({ accessToken, user });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return NextResponse.json(
        { error: "유저 정보 조회 실패" },
        { status: 400 },
      );
    }
    return NextResponse.json({ error: "알 수 없는 오류" }, { status: 500 });
  }
}
