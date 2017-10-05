const Server = require('./server.js');
const port = (process.env.PORT || 8080);
const app = Server.app();

if (process.env.NODE_ENV !== 'production') {
  const webpack = require('webpack');
  // const webpackDevServer = require('webpack-dev-server');
  const webpackDevMiddleware = require('webpack-dev-middleware');
  const webpackHotMiddleware = require('webpack-hot-middleware');
  const config = require('./webpack.dev.config.js');
  const compiler = webpack(config);

  app.use(webpackHotMiddleware(compiler));
  app.use(webpackDevMiddleware(compiler, {
    hot: true,
    noInfo: false,
    publicPath: config.output.publicPath,
    disableHostCheck: true,
    watchOptions: {
      aggregateTimeout: 300,
      poll: 500,
    },
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
      'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization',
    },
    stats: {
      // Config for minimal console.log mess.
      assets: false,
      colors: true,
      version: false,
      hash: false,
      timings: false,
      chunks: false,
      chunkModules: false
    },
  }));
}

app.listen(port);
console.log(`Listening at http://0.0.0.0:${port}`);
