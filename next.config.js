/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    // Fixes npm packages that depend on `fs` module
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }

    config.module.rules.push({
      test: /\.js$/,
      use: [
        {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
          },
        },
      ],
      include: [/node_modules\/puppeteer/, /node_modules\/puppeteer-core/],
    });

    return config;
  },
  // Disable server-side rendering for pages using Puppeteer
  experimental: {
    serverComponentsExternalPackages: ["puppeteer", "puppeteer-core"],
  },
};

module.exports = nextConfig;
