/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    runtime: "edge",
  },
  webpack: (config, { isServer, webpack }) => {
    if (isServer) {
      config.externals.push({
        "playwright-core": "playwright-core",
      });
    }
    return config;
  },
};

module.exports = nextConfig;
