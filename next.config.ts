import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Empty turbopack config to silence warnings
  turbopack: {},
  
  // Ignore problematic packages in build
  transpilePackages: [],
  
  // Webpack config for production builds
  webpack: (config, { isServer }) => {
    // Required for WalletConnect / wagmi packages
    config.resolve.fallback = { 
      fs: false, 
      net: false, 
      tls: false,
      crypto: false,
    };
    
    // Externalize problematic packages
    if (!isServer) {
      config.externals = config.externals || [];
    }
    
    return config;
  },
  
  // Experimental features
  experimental: {
    // Optimize package imports
    optimizePackageImports: ['lucide-react', 'framer-motion'],
  },
};

export default nextConfig;
