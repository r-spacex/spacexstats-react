const path = require('path');
const webpack = require('webpack');

const context = __dirname + '/app';
module.exports = {
  devtool: 'source-map',
  context: context,
  entry: [
    path.join(__dirname, './app/index.js')
  ],
  resolve: {
    alias: {
      app: 'app',
    },
    modules: [
      context,
      'node_modules',
    ],
  },
  output: {
    path: path.join(__dirname, 'public'),
    filename: 'bundle.js',
    publicPath: '/public/',
  },
  plugins: [
    // Handles uglifying js
    new webpack.optimize.UglifyJsPlugin({
      compressor: {
        warnings: false,
        screw_ie8: true
      }
    }),
    // plugin for passing in data to the js, like what NODE_ENV we are in.
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production')
    }),
  ],
  module: {
    rules: [{
      enforce: 'pre',
      test: /\.js$/,
      exclude: /node_modules/,
      loader: 'eslint-loader',
      options: {
        configFile: '.eslintrc',
        failOnWarning: false,
        failOnError: false
      }
    }, {
      test: /\.js?$/,
      exclude: /node_modules/,
      loader: 'babel-loader',
    }, {
      test: /\.styl$/,
      loader: 'style-loader!css-loader!stylus-loader',
    }],
  },
};
