const merge = require('webpack-merge');
const path = require('path');
const common = require('./webpack.config.common');

module.exports = merge(common, {
  devtool: 'inline-source-map',
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    host: '0.0.0.0',
    public: 'spacexstats.test:8080',
    port: 8080,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    watchOptions: {
      poll: true,
    },
  },
});
