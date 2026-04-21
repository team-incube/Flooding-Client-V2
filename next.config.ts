import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  transpilePackages: ["msw"],
  turbopack: {
    root: process.cwd(),
  },
};

export default nextConfig;
