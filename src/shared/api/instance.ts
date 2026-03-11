import axios from "axios";

export const instance = axios.create({
  headers: { "Content-Type": "application/json" },
});

if (typeof window !== "undefined") {
  instance.interceptors.request.use((config) => {
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

      if (
        error.response?.status === 401 &&
        !originalRequest._retried &&
        !originalRequest.url?.includes("/api/auth/refresh")
      ) {
        originalRequest._retried = true;

        try {
          const { data } = await axios.post("/api/auth/refresh");
          sessionStorage.setItem("access_token", data.accessToken);
          originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
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
