import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { code, codeVerifier } = await request.json();

  const tokenRes = await fetch(process.env.DATAGSM_TOKEN_URL!, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      grant_type: "authorization_code",
      code,
      client_id: process.env.NEXT_PUBLIC_DG_CLIENT_ID,
      redirect_uri: process.env.NEXT_PUBLIC_DG_REDIRECT_URL,
      code_verifier: codeVerifier,
    }),
  });

  if (!tokenRes.ok) {
    const errorBody = await tokenRes.text();
    console.error("[auth/callback] 토큰 교환 실패:", tokenRes.status, errorBody);
    return NextResponse.json(
      { error: "토큰 교환 실패", detail: errorBody },
      { status: 400 },
    );
  }

  const { data: tokenData } = await tokenRes.json();
  const accessToken = tokenData.access_token;

  const userRes = await fetch(process.env.DATAGSM_USERINFO_URL!, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!userRes.ok) {
    const errorBody = await userRes.text();
    console.error("[auth/callback] 유저 정보 조회 실패:", userRes.status, errorBody);
    return NextResponse.json(
      { error: "유저 정보 조회 실패", detail: errorBody },
      { status: 400 },
    );
  }

  const user = await userRes.json();

  return NextResponse.json({ accessToken, user });
}
