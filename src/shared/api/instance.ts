import axios, { HttpStatusCode } from "axios";

export const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

export const serverInstance = axios.create({
  headers: { "Content-Type": "application/json" },
});

const authPathsWithoutRefresh = [
  "/api/auth/callback",
  "/api/auth/refresh",
  "/api/auth/signout",
];

let refreshPromise: Promise<string> | null = null;

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

    const originalRequest = error.config;

    if (
      error.response?.status === HttpStatusCode.Unauthorized &&
      !originalRequest._retried &&
      !authPathsWithoutRefresh.some((path) =>
        originalRequest.url?.includes(path),
      )
    ) {
      originalRequest._retried = true;

      try {
        if (!refreshPromise) {
          refreshPromise = axios
            .post("/api/auth/refresh")
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
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return instance(originalRequest);
      } catch {
        sessionStorage.removeItem("access_token");
        window.location.href = "/signin";
      }
    }

    return Promise.reject(error);
  },
);
