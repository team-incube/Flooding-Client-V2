import { Readable } from "node:stream";
import axios, { HttpStatusCode } from "axios";
import { NextRequest, NextResponse } from "next/server";
import { serverInstance } from "@/shared/api/instance";

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

/**
 * 업스트림 SSE 엔드포인트와의 연결을 수립합니다.
 * @param url 업스트림 SSE 절대 URL
 * @param accessToken
 * @param signal
 * @returns AxiosResponse
 */
async function getSseStream(
  url: string,
  accessToken: string,
  signal?: AbortSignal,
) {
  // SSE는 무제한 연결이므로 자동 연결 끊김 방지를 위해 timeout 0을 사용합니다.
  return serverInstance.get(url, {
    headers: {
      Accept: "text/event-stream",
      Authorization: `Bearer ${accessToken}`,
    },
    responseType: "stream",
    timeout: 0,
    signal,
  });
}

/**
 * Node.js가 전송하는 데이터(청크 = 버퍼(타입: Uint8Array)를) 브라우저 표준 ReadableStream으로 변환합니다.
 * @param upstream
 * @param signal
 * @returns ReadableStream
 */
function createSseProxyResponse(upstream: Readable, signal: AbortSignal) {
  const stream = new ReadableStream<Uint8Array>({
    // ReadableStream이 생성될 때 딱 한번 데이터 업데이트, 중단, 취소를 수행하는 함수를 등록합니다.
    start(controller) {
      if (signal.aborted) {
        upstream.destroy();
        return;
      }
      upstream.on("data", (chunk: Buffer) => {
        controller.enqueue(chunk);
      });
      upstream.on("end", () => {
        controller.close();
      });
      upstream.on("error", (error: unknown) => {
        try {
          controller.error(error);
        } catch (error) {
          console.error("controller.error():", error);
        }
      });

      signal.addEventListener("abort", () => upstream.destroy());
    },
    // 사용자가 수동으로 스트림을 취소할 경우 스트림을 정리합니다.
    cancel(reason) {
      console.log("SSE 스트림 닫힘:", reason);
      upstream.destroy();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      "X-Accel-Buffering": "no",
    },
  });
}

/**
 * 백엔드 SSE 엔드포인트를 프록시합니다.
 * 토큰 획득 → 스트림 연결 → 401 시 토큰 재발급 재시도 → 에러/취소 처리 흐름을 공통으로 처리합니다.
 * @param request
 * @param upstreamPath NEXT_PUBLIC_BASE_URL 기준 업스트림 경로 (예: "/dormitory/music/subscribe")
 */
export async function proxySse(request: NextRequest, upstreamPath: string) {
  if (request.signal.aborted) {
    return new Response(null, { status: HttpStatusCode.NoContent });
  }

  const upstreamUrl = `${process.env.NEXT_PUBLIC_BASE_URL!}${upstreamPath}`;

  try {
    const accessToken = await getAccessToken(request);

    if (!accessToken) {
      return NextResponse.json(
        { error: "access token 없음" },
        { status: HttpStatusCode.Unauthorized },
      );
    }

    try {
      const response = await getSseStream(
        upstreamUrl,
        accessToken,
        request.signal,
      );

      return createSseProxyResponse(response.data, request.signal);
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

      const response = await getSseStream(
        upstreamUrl,
        refreshedAccessToken,
        request.signal,
      );

      return createSseProxyResponse(response.data, request.signal);
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
