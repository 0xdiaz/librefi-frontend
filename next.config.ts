import type { NextConfig } from 'next';

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
    // Handle react-native-async-storage for MetaMask SDK
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
      { message: /Can't resolve '@react-native-async-storage\/async-storage'/ },
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
