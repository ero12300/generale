import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // App autonoma dentro un monorepo pnpm: ancoriamo il file tracing a questa cartella.
  outputFileTracingRoot: __dirname,
};

export default nextConfig;
