import axios, { HttpStatusCode } from "axios";
import { captureFeatureError } from "@/shared/lib/sentry";
import { AUTH_ROUTES, PUBLIC_ROUTES } from "@/shared/config/routes";

/** access_token 자동 재발급 인터셉터에서 제외할 인증 경로 */
const authRoutesWithoutRefresh = Object.values(AUTH_ROUTES);

export const DEFAULT_API_TIMEOUT_MS = 10 * 1000;
export const LONG_API_TIMEOUT_MS = 30 * 1000;
export const DEFAULT_ROUTE_TIMEOUT_MS = DEFAULT_API_TIMEOUT_MS + 2000;
export const LONG_ROUTE_TIMEOUT_MS = LONG_API_TIMEOUT_MS + 2000;

export const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  headers: { "Content-Type": "application/json" },
  timeout: DEFAULT_API_TIMEOUT_MS,
});

export const serverInstance = axios.create({
  headers: { "Content-Type": "application/json" },
  timeout: DEFAULT_API_TIMEOUT_MS,
});

export const sseInstance = axios.create({
  headers: { Accept: "text/event-stream" },
  responseType: "stream",
  timeout: 0,
});

let refreshPromise: Promise<string> | null = null;

function redirectToSignin() {
  if (!PUBLIC_ROUTES.some((page) => page === window.location.pathname)) {
    window.location.replace("/signin");
  }
}

/**
 * refresh_token 쿠키로 access_token을 재발급한다.
 * 동시 호출은 하나의 요청으로 합쳐, rotating refresh token이 중복 호출로
 * 무효화되는 것을 방지한다. (요청 인터셉터의 선제 재발급, 응답 인터셉터의 401 복구,
 * SSE 연결이 모두 이 프로미스를 공유한다.)
 */
export function refreshAccessToken(): Promise<string> {
  if (!refreshPromise) {
    refreshPromise = axios
      .post(AUTH_ROUTES.refresh, undefined, {
        timeout: DEFAULT_ROUTE_TIMEOUT_MS,
      })
      .then(({ data }) => {
        const token = data.data?.accessToken;
        if (!token) {
          throw new Error("Access token is missing");
        }
        sessionStorage.setItem("access_token", token);
        return token as string;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }
  return refreshPromise;
}

/**
 * 요청 인터셉터: access_token이 없으면 공유 refreshAccessToken()에 합류해
 * 토큰이 준비된 뒤 요청을 보낸다(요청 레벨 대기). 진입 시 401 폭포를 방지하며
 * 화면 렌더링에는 관여하지 않는다.
 */
instance.interceptors.request.use(async (config) => {
  if (config.url?.startsWith("/api/")) {
    config.baseURL = undefined;
  }

  if (typeof window === "undefined") return config;

  const skipAuth = authRoutesWithoutRefresh.some((path) =>
    config.url?.includes(path),
  );

  let token = sessionStorage.getItem("access_token");
  if (!token && !skipAuth) {
    token = await refreshAccessToken().catch(() => null);
  }

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/**
 * 응답 인터셉터: 사용 중 access_token이 만료돼 401이 나면 1회 재발급·재시도한다.
 * 재발급도 실패하면 세션을 정리하고 /signin으로 보낸다.
 */
instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (typeof window === "undefined") return Promise.reject(error);

    const config = error.config;

    if (
      error.response?.status === HttpStatusCode.Unauthorized &&
      !config.headers["x-retried"] &&
      !authRoutesWithoutRefresh.some((path) => config.url?.includes(path))
    ) {
      config.headers["x-retried"] = "true";

      try {
        const accessToken = await refreshAccessToken();
        config.headers.Authorization = `Bearer ${accessToken}`;
        return instance(config);
      } catch (refreshError) {
        captureFeatureError(refreshError, {
          feature: "auth",
          action: "refresh",
        });
        sessionStorage.removeItem("access_token");
        redirectToSignin();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);
