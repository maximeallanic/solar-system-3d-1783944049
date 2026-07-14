/** @type {import('next').NextConfig} */
const REPO = 'solar-system-3d-1783944049';
const isProd = process.env.NODE_ENV === 'production';

const nextConfig = {
  reactStrictMode: true,
  output: 'export',
  basePath: isProd ? `/${REPO}` : '',
  assetPrefix: isProd ? `/${REPO}/` : '',
  images: { unoptimized: true },
  webpack: (config, { isServer }) => {
    config.externals.push('canvas', 'jsdom', 'three');
    return config;
  },
};

module.exports = nextConfig;
