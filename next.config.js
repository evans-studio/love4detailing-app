/** @type {import('next').NextConfig} */
const webpack = require('webpack');

const nextConfig = {
  output: 'standalone',
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

    return config;
  },
};

module.exports = nextConfig;