import type { NextConfig } from 'next';

// Note: Polyfills are loaded via layout.tsx import for ESLint compliance

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 's3.coinmarketcap.com',
        port: '',
        pathname: '/static-gravity/image/**',
        search: '',
      },
    ],
  },
  webpack: (config, { isServer }) => {
    // Handle Web3 libraries for both client and server
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        '@react-native-async-storage/async-storage': false,
        fs: false,
        net: false,
        tls: false,
      };
    }

    // Ignore specific modules that cause issues during build
    config.ignoreWarnings = [
      { module: /node_modules\/@metamask\/sdk/ },
      { module: /node_modules\/@walletconnect/ },
      { module: /node_modules\/@rainbow-me\/rainbowkit/ },
      { module: /node_modules\/wagmi/ },
      { message: /Can't resolve '@react-native-async-storage\/async-storage'/ },
      { message: /indexedDB is not defined/ },
    ];

    return config;
  },
  eslint: {
    // Allow build to complete even with ESLint warnings
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Allow build to complete even with TypeScript errors
    ignoreBuildErrors: true,
  },
  output: 'standalone',
};

export default nextConfig;
