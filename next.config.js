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

    // Ignore warnings from @supabase/realtime-js
    config.ignoreWarnings = [
      { module: /@supabase\/realtime-js/ },
    ];

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