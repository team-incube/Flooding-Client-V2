export const COOKIE_CONFIG = {
  refreshToken: {
    name: "refresh_token",
    options: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 14,
      path: "/",
      sameSite: "lax" as const,
    },
  },
};
