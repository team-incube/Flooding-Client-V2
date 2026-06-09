import { refreshAccessToken } from "@/shared/api/instance";

interface AuthorizedSseConfig {
  /** NEXT_PUBLIC 기준 SSE 라우트 경로 (예: "/api/dormitory/music/subscribe") */
  path: string;
  /** 이벤트 타입 → 핸들러. open/error는 onOpen/onError로 전달한다. */
  listeners: Record<string, (event: MessageEvent<string>) => void>;
  onOpen?: () => void;
  onError?: () => void;
}

const INITIAL_RECONNECT_DELAY_MS = 1000;
const MAX_RECONNECT_DELAY_MS = 30000;

/**
 * access_token을 쿼리 파라미터로 실어 인증된 SSE에 연결한다.
 *
 * EventSource는 Authorization 헤더를 보낼 수 없어 토큰을 쿼리로 전달하며,
 * 토큰 재발급은 전적으로 공유 refreshAccessToken()(/api/auth/refresh)에 위임한다.
 * 프록시는 더 이상 독립적으로 reissue하지 않으므로 refresh token 회전 경쟁이 없다.
 *
 * 재연결 정책:
 * - 연결이 한 번도 open되지 않고 끊기면(=인증 실패 가능성) 토큰을 새로 받아 재연결한다.
 * - open된 뒤 끊기면(=스트림 드롭/백엔드 init 종료) 토큰 회전 없이 재연결해 회전 폭주를 막는다.
 *
 * @returns 정리(cleanup) 함수
 */
export function openAuthorizedSse({
  path,
  listeners,
  onOpen,
  onError,
}: AuthorizedSseConfig): () => void {
  let eventSource: EventSource | null = null;
  let reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  let reconnectDelay = INITIAL_RECONNECT_DELAY_MS;
  let closed = false;

  const scheduleReconnect = (forceRefresh: boolean) => {
    if (closed || reconnectTimer) return;
    reconnectTimer = setTimeout(() => {
      reconnectTimer = null;
      void connect(forceRefresh);
    }, reconnectDelay);
    reconnectDelay = Math.min(reconnectDelay * 2, MAX_RECONNECT_DELAY_MS);
  };

  const connect = async (forceRefresh: boolean) => {
    let token = sessionStorage.getItem("access_token");
    if (!token || forceRefresh) {
      token = await refreshAccessToken().catch(() => null);
    }
    if (closed || !token) return;

    const params = new URLSearchParams({ accessToken: token });
    const source = new EventSource(`${path}?${params.toString()}`);
    eventSource = source;

    let opened = false;

    source.addEventListener("open", () => {
      opened = true;
      reconnectDelay = INITIAL_RECONNECT_DELAY_MS;
      onOpen?.();
    });

    for (const [type, handler] of Object.entries(listeners)) {
      source.addEventListener(type, handler as EventListener);
    }

    source.addEventListener("error", () => {
      onError?.();
      source.close();
      // open조차 못 했으면 토큰 만료/인증 실패 가능성 → 새 토큰으로 재연결
      scheduleReconnect(!opened);
    });
  };

  void connect(false);

  return () => {
    closed = true;
    if (reconnectTimer) clearTimeout(reconnectTimer);
    eventSource?.close();
  };
}
