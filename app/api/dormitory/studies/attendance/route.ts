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

  return getRefreshedAccessToken(request);
}

async function getRefreshedAccessToken(request: NextRequest) {
  const refreshToken = request.cookies.get("refresh_token")?.value;

  if (!refreshToken) {
    return null;
  }

  const reissueUrl = `${process.env.NEXT_PUBLIC_BASE_URL!}/auth/reissue`;

  const { data } = await serverInstance.post(reissueUrl, {
    refreshToken,
  });

  return data.data?.accessToken ?? data.accessToken ?? null;
}

async function getAttendanceStream(accessToken: string) {
  const attendanceUrl = `${process.env.NEXT_PUBLIC_BASE_URL!}/dormitory/studies/attendance`;

  const response = await serverInstance.get(attendanceUrl, {
    headers: {
      Accept: "text/event-stream",
      Authorization: `Bearer ${accessToken}`,
    },
    responseType: "stream",
    timeout: 0,
  });

  const stream = response.data as Readable;

  stream.on("error", () => {
    console.error("[SSE] upstream stream error");
  });

  return response;
}

function createAttendanceStreamResponse(data: unknown) {
  const stream = data as Readable;

  return new Response(Readable.toWeb(stream) as ReadableStream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}

export async function GET(request: NextRequest) {
  if (request.signal.aborted) {
    return new Response(null, { status: HttpStatusCode.NoContent });
  }

  try {
    const accessToken = await getAccessToken(request);

    if (!accessToken) {
      return NextResponse.json(
        { error: "access token 없음" },
        { status: HttpStatusCode.Unauthorized },
      );
    }

    try {
      const response = await getAttendanceStream(accessToken);

      return createAttendanceStreamResponse(response.data);
    } catch (error) {
      console.error("[SSE] 최초 SSE 연결 실패");

      if (
        !axios.isAxiosError(error) ||
        error.response?.status !== HttpStatusCode.Unauthorized
      ) {
        throw error;
      }

      const refreshedAccessToken = await getRefreshedAccessToken(request);

      if (!refreshedAccessToken) {
        throw error;
      }

      if (request.signal.aborted) {
        return new Response(null, { status: HttpStatusCode.NoContent });
      }

      const response = await getAttendanceStream(refreshedAccessToken);

      return createAttendanceStreamResponse(response.data);
    }
  } catch (error) {
    console.error("[SSE] 최종 에러");

    if (axios.isAxiosError(error) && error.code === "ERR_CANCELED") {
      return new Response(null, { status: HttpStatusCode.NoContent });
    }

    const fallbackBody = {
      error: "SSE 요청 실패",
    };

    if (axios.isAxiosError(error) && error.response) {
      const { data, status } = error.response;

      if (data instanceof Readable) {
        data.destroy();
        return NextResponse.json(fallbackBody, { status });
      }

      return NextResponse.json(data ?? fallbackBody, { status });
    }

    return NextResponse.json(
      { error: "Internal Server Error" },
      {
        status: HttpStatusCode.InternalServerError,
      },
    );
  }
}
