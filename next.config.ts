import type {NextConfig} from "next";

const nextConfig: NextConfig = {
  /* config options here */
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
