import { Readable } from "node:stream";
import axios, { HttpStatusCode } from "axios";
import { NextRequest, NextResponse } from "next/server";
import { serverInstance } from "@/shared/api/instance";

export const runtime = "nodejs";

async function getAccessToken(request: NextRequest) {
  const queryToken = request.nextUrl.searchParams.get("accessToken");

  if (queryToken) {
    return queryToken;
  }

  const refreshToken = request.cookies.get("refresh_token")?.value;

  if (!refreshToken) {
    return null;
  }

  const reissueUrl = `${process.env.NEXT_PUBLIC_BASE_URL!}/auth/reissue`;
  const { data } = await serverInstance.post(reissueUrl, { refreshToken });

  return data.data?.accessToken ?? data.accessToken ?? null;
}

export async function GET(request: NextRequest) {
  try {
    const accessToken = await getAccessToken(request);

    if (!accessToken) {
      return NextResponse.json(
        { error: "access token 없음" },
        { status: HttpStatusCode.Unauthorized },
      );
    }

    const attendanceUrl = `${process.env.NEXT_PUBLIC_BASE_URL!}/dormitory/studies/attendance`;
    const response = await serverInstance.get(attendanceUrl, {
      headers: {
        Accept: "text/event-stream",
        Authorization: `Bearer ${accessToken}`,
      },
      responseType: "stream",
      signal: request.signal,
    });

    return new Response(Readable.toWeb(response.data) as ReadableStream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache, no-transform",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return NextResponse.json(error.response.data, {
        status: error.response.status,
      });
    }

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: HttpStatusCode.InternalServerError },
    );
  }
}
