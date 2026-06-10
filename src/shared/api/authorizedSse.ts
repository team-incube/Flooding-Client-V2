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
 * 표준 EventSource는 Authorization 헤더를 보낼 수 없어 토큰을 URL 쿼리로 싣고
 * 재연결마다 만료된 토큰을 그대로 재사용하는 한계가 있다. 여기서는 fetch 주입을
 * 지원하는 eventsource 라이브러리를 사용해, 재연결마다 호출되는 fetch가
 * sessionStorage의 최신 access_token을 Authorization 헤더로 싣는다.
 *
 * - 401이면 공유 refreshAccessToken()으로 갱신해 1회 재시도한다.
 * - 갱신까지 실패하면 401을 그대로 반환해 라이브러리가 재연결을 멈춘다(무한 루프 방지).
 * - 단순 네트워크 드롭의 재연결·Last-Event-ID는 라이브러리에 위임한다.
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

  const eventSource = new EventSource(path, { fetch: fetchWithAuth });

  eventSource.addEventListener("open", () => onOpen?.());
  eventSource.addEventListener("error", () => onError?.());
  for (const [type, handler] of Object.entries(listeners)) {
    eventSource.addEventListener(type, handler);
  }

  return () => eventSource.close();
}
