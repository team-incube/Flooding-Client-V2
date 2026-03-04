import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const authorization = request.headers.get("Authorization");

  if (!authorization) {
    return NextResponse.json({ error: "인증 토큰 없음" }, { status: 401 });
  }

  const userRes = await fetch(process.env.DATAGSM_USERINFO_URL!, {
    headers: { Authorization: authorization },
  });

  if (!userRes.ok) {
    return NextResponse.json(
      { error: "유저 정보 조회 실패" },
      { status: userRes.status },
    );
  }

  const user = await userRes.json();
  return NextResponse.json(user);
}
