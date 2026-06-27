import { HttpStatusCode } from "axios";
import { EventSource, type FetchLike } from "eventsource";
import { refreshAccessToken } from "@/shared/api/instance";

interface AuthorizedSseConfig {
  path: string;
  listeners: Record<string, (event: MessageEvent<string>) => void>;
  onOpen?: () => void;
  onError?: () => void;
}

/**
 * 인증된 SSE에 연결한다.
 *
 * fetch 주입을 지원하는 eventsource 라이브러리로 재연결마다 sessionStorage의
 * 최신 access_token을 Authorization 헤더에 싣는다. 401이면 refreshAccessToken()으로
 * 1회 재시도하고, 그래도 실패하면 401을 그대로 반환해 재연결을 멈춘다.
 *
 * 백그라운드(hidden)에서 끊기면 재연결 churn으로 토스트가 누적되므로 재시도하지 않고,
 * visible 복귀 시 한 번만 재연결한다.
 *
 * @returns 정리(cleanup) 함수
 */
export function openAuthorizedSse({
  path,
  listeners,
  onOpen,
  onError,
}: AuthorizedSseConfig): () => void {
  const fetchWithAuth: FetchLike = async (url, init) => {
    const request = (accessToken: string | null) =>
      fetch(url, {
        ...init,
        headers: accessToken
          ? { ...init.headers, Authorization: `Bearer ${accessToken}` }
          : init.headers,
      });

    const response = await request(sessionStorage.getItem("access_token"));
    if (response.status !== HttpStatusCode.Unauthorized) return response;

    const refreshed = await refreshAccessToken().catch(() => null);
    return refreshed ? request(refreshed) : response;
  };

  let eventSource: EventSource | null = null;

  const connect = () => {
    const source = new EventSource(path, { fetch: fetchWithAuth });
    eventSource = source;

    source.addEventListener("open", () => onOpen?.());
    source.addEventListener("error", () => {
      onError?.();
      if (document.visibilityState === "hidden") {
        source.close();
        eventSource = null;
      }
    });
    for (const [type, handler] of Object.entries(listeners)) {
      source.addEventListener(type, handler);
    }
  };

  const handleVisibilityChange = () => {
    if (document.visibilityState === "visible" && !eventSource) connect();
  };

  connect();
  document.addEventListener("visibilitychange", handleVisibilityChange);

  return () => {
    document.removeEventListener("visibilitychange", handleVisibilityChange);
    eventSource?.close();
  };
}
