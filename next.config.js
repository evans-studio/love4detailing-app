/** @type {import('next').NextConfig} */
const webpack = require('webpack');

const nextConfig = {
  output: 'standalone',
  poweredByHeader: false,
  images: {
    domains: ['epkbxehlwtzukeokykw.supabase.co'],
  },
  experimental: {
    optimizePackageImports: ['@mantine/core', '@radix-ui/react-*', 'gsap'],
    serverActions: true,
  },
  // Optimize font loading
  optimizeFonts: true,
  // Disable automatic font optimization to prevent preload warnings
  fontLoaderOptions: {
    preload: false,
  },
  webpack: (config, { isServer, dev }) => {
    // Handle browser globals and polyfills
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: require.resolve('crypto-browserify'),
      };
    }

    // Optimize chunk loading
    config.optimization = {
      ...config.optimization,
      moduleIds: 'deterministic',
      chunkIds: 'deterministic',
      splitChunks: {
        chunks: 'all',
        cacheGroups: {
          default: false,
          vendors: false,
          commons: {
            name: 'commons',
            chunks: 'all',
            minChunks: 2,
            reuseExistingChunk: true,
          },
        },
      },
    };

    return config;
  },
  // Add proper headers for RSC
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'RSC-Action',
            value: 'react-server-component',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;