import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";

const nextConfig: NextConfig = {
  reactCompiler: true,
  transpilePackages: ["msw"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "img.youtube.com",
      },
      {
        protocol: "https",
        hostname: "i.ytimg.com",
      },
      {
        protocol: "https",
        hostname: "*.r2.dev",
      },
    ],
  },
  turbopack: {
    root: process.cwd(),
  },
};

export default withSentryConfig(nextConfig, {
  org: "flooding",
  project: "flooding-client-v2",
  silent: !process.env.CI,
  authToken: process.env.SENTRY_AUTH_TOKEN,
  disableLogger: true,
  tunnelRoute: "/monitoring",
});
