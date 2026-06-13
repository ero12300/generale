import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Progetto isolato dal monorepo: fissa la root per il file tracing così Next
  // non confonde il lockfile della cartella padre con quello locale.
  outputFileTracingRoot: path.join(__dirname),
};

export default nextConfig;
