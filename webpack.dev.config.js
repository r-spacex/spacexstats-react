const path = require('path');
const webpack = require('webpack');

const context = __dirname + '/app';
module.exports = {
  devtool: 'eval',
  context: context,
  entry: [
    'webpack-hot-middleware/client',
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
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('development')
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
  devServer: {
    contentBase: context,
    port: 8080,
    hot: true,
    inline: false,
    historyApiFallback: true,
  },
};
