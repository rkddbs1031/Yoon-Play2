import type { NextConfig } from 'next';
import path from 'path';

const nextConfig: NextConfig = {
  /* config options here */
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });

    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      jotai: path.resolve(__dirname, 'node_modules/jotai'),
    };
    return config;
  },
  images: {
    domains: ['i.ytimg.com'],
  },
};

export default nextConfig;
