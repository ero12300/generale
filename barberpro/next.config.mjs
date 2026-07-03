import { fileURLToPath } from "node:url";
import { dirname } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // L'app vive in una sottocartella del monorepo: fissiamo la root del tracing.
  outputFileTracingRoot: __dirname,
};

export default nextConfig;
