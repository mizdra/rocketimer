const { resolve } = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const { GenerateSW } = require('workbox-webpack-plugin');

const rootPath = resolve(__dirname, '.');
const libPath = resolve(__dirname, './lib');
const staticPath = resolve(__dirname, './static');
const srcPath = resolve(__dirname, './src');
const distPath = resolve(__dirname, './dist');

/** @type import('webpack').ConfigurationFactory */
module.exports = (_env, _argv) => ({
  entry: {
    app: [
      resolve(libPath, './google-analysis.js'),
      resolve(libPath, './service-worker.js'),
      'tslib',
      resolve(srcPath, './index.tsx'),
    ],
  },
  output: {
    path: distPath,
    filename: 'js/[name].[contenthash].js',
  },
  devtool: 'eval-source-map',

  optimization: {
    minimizer: [
      new TerserPlugin({
        terserOptions: { mangle: false },
      }),
    ],
  },

  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'babel-loader',
      },
      {
        test: /\.mp3$/i,
        use: ['file-loader'],
      },
    ],
  },

  resolve: {
    extensions: ['.js', '.ts', '.tsx', '.json'],
    alias: {
      'react-dom$': 'react-dom/profiling',
      'scheduler/tracing': 'scheduler/tracing-profiling',
    },
  },

  plugins: [
    new HtmlWebpackPlugin({
      filename: resolve(distPath, './index.html'),
      template: resolve(rootPath, './index.html'),
      inject: true,
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: staticPath,
          to: '.',
        },
      ],
    }),
    new GenerateSW({
      cacheId: 'rocketimer',
      swDest: resolve(distPath, './service-worker.js'),
    }),
  ],

  devServer: {
    headers: {
      'Cross-Origin-Embedder-Policy': 'require-corp',
      'Cross-Origin-Opener-Policy': 'same-origin',
    },
  },
});
