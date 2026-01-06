import type {NextConfig} from "next";

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    // Don't run TypeScript checking during builds
    ignoreBuildErrors: true,
  },
  // Empty turbopack config to silence migration warning
  turbopack: {},
};

export default nextConfig;
