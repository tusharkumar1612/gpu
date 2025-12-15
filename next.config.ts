import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Empty turbopack config to silence warnings
  turbopack: {},
  
  // Webpack config for production builds (when using --no-turbopack)
  webpack: (config) => {
    // Required for WalletConnect / RainbowKit
    config.resolve.fallback = { fs: false, net: false, tls: false };
    config.externals.push('pino-pretty', 'lokijs', 'encoding');
    return config;
  },
};

export default nextConfig;
