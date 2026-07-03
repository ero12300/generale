import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["firebasestorage.googleapis.com", "lh3.googleusercontent.com"],
  },
  experimental: {
    serverActions: {
      allowedOrigins: ["localhost:3001"],
    },
  },
};

export default nextConfig;
