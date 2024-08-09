module.exports = {
  webpack: (config, { isServer }) => {
    config.module.rules.push({
      test: /\.map$/,
      use: ["ignore-loader"],
    });
    return config;
  },
};
