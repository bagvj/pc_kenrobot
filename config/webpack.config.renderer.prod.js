/**
 * Build config for electron renderer process
 */

import path from 'path';
import webpack from 'webpack';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import merge from 'webpack-merge';
import UglifyJSPlugin from 'uglifyjs-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import baseConfig from './webpack.config.base';
import CheckNodeEnv from '../internals/scripts/CheckNodeEnv';

CheckNodeEnv('production');

const DEBUG = process.env.DEBUG_PROD === "true";

export default merge.smart(baseConfig, {
  devtool: 'source-map',

  target: 'electron-renderer',

  entry: {
    index: path.resolve(__dirname, '../src/renderer/index.js'),
    kenrobot: path.resolve(__dirname, '../src/renderer/kenrobot.js'),
  },

  output: {
    path: path.resolve(__dirname, '../app/renderer'),
    publicPath: './renderer/',
    filename: '[name].js'
  },

  module: {
    rules: [
      // Extract all .global.css to style.css as is
      {
        test: /(antd.*\.css$)|(\.global\.css$)/,
        use: ExtractTextPlugin.extract({
          publicPath: './',
          use: {
            loader: 'css-loader',
            options: {
              minimize: true,
              camelCase: true,
            }
          },
          fallback: 'style-loader',
        })
      },
      // Pipe other styles through css modules and append to style.css
      {
        test: /^((?!\.global).)*\.css$/,
        exclude: /node_modules/,
        use: ExtractTextPlugin.extract({
          use: {
            loader: 'css-loader',
            options: {
              modules: true,
              minimize: true,
              importLoaders: 1,
              camelCase: true,
              localIdentName: '[name]__[local]__[hash:base64:5]',
            }
          }
        }),
      },
      // Add SASS support  - compile all .global.scss files and pipe it to style.css
      {
        test: /\.global\.scss$/,
        use: ExtractTextPlugin.extract({
          use: [
            {
              loader: 'css-loader',
              options: {
                minimize: true,
                camelCase: true,
              }
            },
            {
              loader: 'sass-loader'
            }
          ],
          fallback: 'style-loader',
        })
      },
      // Add SASS support  - compile all other .scss files and pipe it to style.css
      {
        test: /^((?!\.global).)*\.scss$/,
        exclude: /node_modules/,
        use: ExtractTextPlugin.extract({
          use: [{
            loader: 'css-loader',
            options: {
              modules: true,
              minimize: true,
              importLoaders: 1,
              camelCase: true,
              localIdentName: '[name]__[local]__[hash:base64:5]',
            }
          },
          {
            loader: 'sass-loader'
          }]
        }),
      },
      // Add LESS support  - compile all .global.less files and pipe it to style.css
      {
        test: /(antd.*\.less$)|(\.global\.less$)/,
        use: ExtractTextPlugin.extract({
          use: [
            {
              loader: 'css-loader',
              options: {
                minimize: true,
                camelCase: true,
              }
            },
            {
              loader: 'less-loader'
            }
          ],
          fallback: 'style-loader',
        })
      },
      // Add LESS support  - compile all other .less files and pipe it to style.css
      {
        test: /^((?!\.global).)*\.less$/,
        exclude: /node_modules/,
        use: ExtractTextPlugin.extract({
          use: [{
            loader: 'css-loader',
            options: {
              modules: true,
              minimize: true,
              importLoaders: 1,
              camelCase: true,
              localIdentName: '[name]__[local]__[hash:base64:5]',
            }
          },
          {
            loader: 'less-loader'
          }]
        }),
      },
      // WOFF Font
      {
        test: /\.woff(\?v=\d+\.\d+\.\d+)?$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 10000,
            mimetype: 'application/font-woff',
            name: 'assets/[hash].[ext]',
          }
        },
      },
      // WOFF2 Font
      {
        test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 10000,
            mimetype: 'application/font-woff',
            name: 'assets/[hash].[ext]',
          }
        }
      },
      // TTF Font
      {
        test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 10000,
            mimetype: 'application/octet-stream',
            name: 'assets/[hash].[ext]',
          }
        }
      },
      // EOT Font
      {
        test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
        use: {
          loader: 'file-loader',
          options: {
            name: 'assets/[hash].[ext]',
          }
        },
      },
      // SVG Font
      {
        test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 10000,
            mimetype: 'image/svg+xml',
            name: 'assets/[hash].[ext]',
          }
        }
      },
      // Common Image Formats
      {
        test: /\.(?:ico|gif|png|jpg|jpeg|webp)$/,
        use: {
          loader: 'url-loader',
          options: {
            name: 'assets/[hash].[ext]',
          }
        }
      }
    ]
  },

  plugins: [
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
      NODE_ENV: 'production',
      DEBUG_PROD: JSON.stringify(DEBUG)
    }),

    // new UglifyJSPlugin({
    //   parallel: true,
    //   sourceMap: true
    // }),

    new ExtractTextPlugin('style.css'),

    // new BundleAnalyzerPlugin({
    //   analyzerMode: process.env.OPEN_ANALYZER === 'true' ? 'server' : 'disabled',
    //   openAnalyzer: process.env.OPEN_ANALYZER === 'true'
    // }),

    new CopyWebpackPlugin([{
      from: path.resolve(__dirname, '../src/renderer/index.html'),
      to: '[name].html'
    }]),
  ].concat(DEBUG ? [] : [
    new UglifyJSPlugin({
      parallel: true,
      sourceMap: true
    }),
  ]),
});
