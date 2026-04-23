import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  transpilePackages: ["msw"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "img.youtube.com",
      },
    ],
  },
  turbopack: {
    root: process.cwd(),
  },
};

export default nextConfig;
