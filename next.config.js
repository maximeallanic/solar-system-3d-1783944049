/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'export',
  webpack: (config, { isServer }) => {
    config.externals.push('canvas', 'jsdom');
    return config;
  },
};

module.exports = nextConfig;
