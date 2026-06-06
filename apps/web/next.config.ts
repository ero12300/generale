import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Build self-contained per il Dockerfile (.next/standalone).
  output: "standalone",
};

export default nextConfig;
