// next.config.mjs
import MiniCssExtractPlugin from 'mini-css-extract-plugin';

export default {
  images: {
    domains: ['img.clerk.com'],
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.plugins.push(
        new MiniCssExtractPlugin({
          filename: 'static/css/[name].[contenthash].css',
          chunkFilename: 'static/css/[name].[contenthash].css',
        })
      );
    }

    return config;
  },
};