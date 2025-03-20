import type {NextConfig} from "next";

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    // Don't run ESLint during builds
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Don't run TypeScript checking during builds
    ignoreBuildErrors: true,
  },
  webpack: (config, { isServer }) => {
    // Handle browser-incompatible modules
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        os: false,
        crypto: false,
        // Add other Node.js modules if needed
      };
    }
    
    return config;
  },
};

export default nextConfig;
