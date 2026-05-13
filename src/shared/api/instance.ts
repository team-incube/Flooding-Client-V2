import axios, { HttpStatusCode } from "axios";

export const DEFAULT_API_TIMEOUT_MS = 10 * 1000;
export const LONG_API_TIMEOUT_MS = 30 * 1000;

export const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  headers: { "Content-Type": "application/json" },
  timeout: DEFAULT_API_TIMEOUT_MS,
});

export const serverInstance = axios.create({
  headers: { "Content-Type": "application/json" },
  timeout: DEFAULT_API_TIMEOUT_MS,
});

const authPathsWithoutRefresh = [
  "/api/auth/callback",
  "/api/auth/refresh",
  "/api/auth/signout",
];

let refreshPromise: Promise<string> | null = null;

function redirectToSignin() {
  const authPages = ["/signin", "/callback"];

  if (!authPages.includes(window.location.pathname)) {
    window.location.replace("/signin");
  }
}

instance.interceptors.request.use((config) => {
  if (config.url?.startsWith("/api/")) {
    config.baseURL = undefined;
  }

  if (typeof window !== "undefined") {
    const token = sessionStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (typeof window === "undefined") return Promise.reject(error);

    const config = error.config;

    if (
      error.response?.status === HttpStatusCode.Unauthorized &&
      !config.headers["x-retried"] &&
      !authPathsWithoutRefresh.some((path) => config.url?.includes(path))
    ) {
      config.headers["x-retried"] = "true";

      try {
        if (!refreshPromise) {
          refreshPromise = axios
            .post("/api/auth/refresh", undefined, {
              timeout: DEFAULT_API_TIMEOUT_MS,
            })
            .then(({ data }) => {
              const token = data.data?.accessToken;
              if (!token) {
                throw new Error("Access token is missing");
              }
              sessionStorage.setItem("access_token", token);
              return token;
            })
            .finally(() => {
              refreshPromise = null;
            });
        }

        const accessToken = await refreshPromise;
        config.headers.Authorization = `Bearer ${accessToken}`;
        return instance(config);
      } catch (refreshError) {
        sessionStorage.removeItem("access_token");
        redirectToSignin();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);
