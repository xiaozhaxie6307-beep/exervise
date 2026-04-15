/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
// const webpack = require('webpack');
// const TerserPlugin = require('terser-webpack-plugin');
const JavaScriptObfuscator = require('webpack-obfuscator');

module.exports = {
  devtool: 'source-map',
  entry: { main: ['./src/main.ts'] },
  target: 'node',
  node: {
    __dirname: false,
    __filename: false,
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
    modules: ['node_modules', 'src'],
    alias: {
      src: path.resolve(__dirname, 'src'),
    },
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
    sourceMapFilename: '[file].map',
  },
  plugins: [
    // TerserPlugin 用于混淆代码
    // 可参考 https://webpack.js.org/plugins/terser-webpack-plugin/ 了解具体用法
    // new TerserPlugin({
    //   terserOptions: {
    //     ecma: 2018,
    //     mangle: true,
    //     output: { comments: false },
    //   },
    //   extractComments: false,
    // }),
    // JavaScriptObfuscator 用于混淆代码，将代码变形以增加阅读难度
    // 可参考 https://github.com/webpack-contrib/webpack-obfuscator#options-object-properties 了解具体用法
    new JavaScriptObfuscator({
      rotateUnicodeArray: true,
      compact: true,
      controlFlowFlattening: true,
      deadCodeInjection: true,
      target: 'node',
    }),
  ],
  module: {
    rules: [
      {
        test: /\.ts?$/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              transpileOnly: true,
            },
          },
        ],
        exclude: /node_modules/,
      },
    ],
  },
};
