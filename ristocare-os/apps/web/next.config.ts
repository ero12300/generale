import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@ristocare/types"],
  turbopack: {
    root: "../..",
  },
};

export default nextConfig;
