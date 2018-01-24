/**
 * Webpack config for production electron main process
 */

import path from 'path';
import webpack from 'webpack';
import merge from 'webpack-merge';
import UglifyJSPlugin from 'uglifyjs-webpack-plugin';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import baseConfig from './webpack.config.base';
import CheckNodeEnv from '../internals/scripts/CheckNodeEnv';

CheckNodeEnv('development');

export default merge.smart(baseConfig, {
  devtool: 'source-map',

  target: 'electron-main',

  entry: path.resolve(__dirname, '../src/main/index'),

  // 'main.js' in root
  output: {
    path: path.resolve(__dirname, '../app/main'),
    filename: 'index.js'
  },

  plugins: [
    // new UglifyJSPlugin({
    //   parallel: true,
    //   sourceMap: true
    // }),

    // new BundleAnalyzerPlugin({
    //   analyzerMode: process.env.OPEN_ANALYZER === 'true' ? 'server' : 'disabled',
    //   openAnalyzer: process.env.OPEN_ANALYZER === 'true'
    // }),

    /**
     * Create global constants which can be configured at compile time.
     *
     * Useful for allowing different behaviour between development builds and
     * release builds
     *
     * NODE_ENV should be production so that modules do not perform certain
     * development checks
     */
    new webpack.EnvironmentPlugin({
      NODE_ENV: 'development',
      DEBUG_PROD: 'false'
    })
  ],

  /**
   * Disables webpack processing of __dirname and __filename.
   * If you run the bundle in node.js it falls back to these values of node.js.
   * https://github.com/webpack/webpack/issues/2010
   */
  node: {
    __dirname: false,
    __filename: false
  },
});
