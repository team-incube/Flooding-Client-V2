import { Readable } from "node:stream";
import axios, { HttpStatusCode } from "axios";
import { NextRequest, NextResponse } from "next/server";
import { sseInstance } from "@/shared/api/instance";

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
 * 토큰 검증 → 스트림 연결 → 에러/취소 처리 흐름을 공통으로 처리합니다.
 *
 * 토큰 재발급은 클라이언트의 공유 refreshAccessToken()(/api/auth/refresh)에 단일화한다.
 * 프록시는 reissue하지 않으며, access token이 없거나 업스트림 401이면 그대로 401을
 * 반환해 클라이언트가 새 토큰으로 재연결하도록 한다.
 * access token은 Authorization 헤더(Bearer)로 전달받는다.
 * @param request
 * @param upstreamPath NEXT_PUBLIC_BASE_URL 기준 업스트림 경로 (예: "/dormitory/music/subscribe")
 */
export async function proxySse(request: NextRequest, upstreamPath: string) {
  if (request.signal.aborted) {
    return new Response(null, { status: HttpStatusCode.NoContent });
  }

  const upstreamUrl = `${process.env.NEXT_PUBLIC_BASE_URL!}${upstreamPath}`;

  try {
    const authorization = request.headers.get("authorization");
    const accessToken = authorization?.startsWith("Bearer ")
      ? authorization.slice("Bearer ".length)
      : null;

    if (!accessToken) {
      return NextResponse.json(
        { error: "access token 없음" },
        { status: HttpStatusCode.Unauthorized },
      );
    }

    const response = await sseInstance.get(upstreamUrl, {
      headers: { Authorization: `Bearer ${accessToken}` },
      signal: request.signal,
    });

    return createSseProxyResponse(response.data, request.signal);
  } catch (error) {
    console.error("[SSE] 연결 실패");

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
