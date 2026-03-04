import axios from "axios";
import { NextRequest, NextResponse } from "next/server";
import { instance } from "@/shared/api/instance";

export async function POST(request: NextRequest) {
  const refreshToken = request.cookies.get("refresh_token")?.value;

  if (!refreshToken) {
    return NextResponse.json({ error: "refresh_token 없음" }, { status: 401 });
  }

  try {
    const { data: body } = await instance.post(process.env.DATAGSM_TOKEN_URL!, {
      grant_type: "refresh_token",
      refresh_token: refreshToken,
      client_id: process.env.NEXT_PUBLIC_DG_CLIENT_ID,
    });

    const newAccessToken: string = body.data.access_token;
    const newRefreshToken: string = body.data.refresh_token;

    const response = NextResponse.json({ accessToken: newAccessToken });
    response.cookies.set("refresh_token", newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/api/auth",
      maxAge: 2592000,
    });

    console.log("response:", response);

    return response;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const response = NextResponse.json(
        { error: "토큰 갱신 실패" },
        { status: 401 },
      );
      response.cookies.delete("refresh_token");
      return response;
    }
    return NextResponse.json({ error: "알 수 없는 오류" }, { status: 500 });
  }
}
