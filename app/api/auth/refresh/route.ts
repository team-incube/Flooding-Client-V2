import axios from "axios";
import { NextRequest, NextResponse } from "next/server";
import { instance } from "@/shared/api/instance";

export async function POST(request: NextRequest) {
  const refreshToken = request.cookies.get("refresh_token")?.value;

  if (!refreshToken) {
    return NextResponse.json({ error: "refresh_token 없음" }, { status: 401 });
  }

  try {
    const reissueUrl = process.env.NEXT_PUBLIC_BASE_URL! + "/auth/reissue";
    const reissueBody = { refreshToken };

    const response = await instance.post(reissueUrl, reissueBody);

    return NextResponse.json(response.data, {
      status: response.status,
    });
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return NextResponse.json(error.response.data, {
        status: error.response.status,
      });
    }

    throw error;
  }
}
