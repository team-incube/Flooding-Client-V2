import axios, { HttpStatusCode } from "axios";
import { toast } from "sonner";

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

if (typeof window !== "undefined") {
  instance.interceptors.request.use((config) => {
    if (config.url?.startsWith("/api/")) {
      config.baseURL = undefined;
    }

    const token = sessionStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  instance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      if (error.response?.status === HttpStatusCode.Forbidden) {
        const isGetRequest = originalRequest.method?.toUpperCase() === "GET";
        const hasToken = !!sessionStorage.getItem("access_token");

        if (isGetRequest || !hasToken) {
          sessionStorage.removeItem("access_token");
          sessionStorage.removeItem("user");
          toast.error("로그인이 필요합니다.");
          window.location.href = "/signin";
          return Promise.reject(error);
        }
      }

      if (
        error.response?.status === 401 &&
        !originalRequest._retried &&
        !authPathsWithoutRefresh.some((path) =>
          originalRequest.url?.includes(path),
        )
      ) {
        originalRequest._retried = true;

        try {
          const { data } = await axios.post("/api/auth/refresh");
          const accessToken = data.data?.accessToken ?? data.accessToken;
          sessionStorage.setItem("access_token", accessToken);
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return instance(originalRequest);
        } catch {
          sessionStorage.removeItem("access_token");
          sessionStorage.removeItem("user");
          window.location.href = "/signin";
        }
      }

      return Promise.reject(error);
    },
  );
}
