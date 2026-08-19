import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Use webpack for production builds (turbopack is dev-only)
  // This avoids the react/jsx-runtime import map conflict with Turbopack
  experimental: {
    turbo: undefined,
  },
  // Transpile packages that need it
  transpilePackages: [],
  // Image optimization
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**" },
    ],
  },
  // Env vars available to client
  env: {
    NEXT_PUBLIC_DEMO_MODE: process.env.NEXT_PUBLIC_DEMO_MODE ?? "true",
  },
};

export default nextConfig;
