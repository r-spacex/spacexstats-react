import express from 'express';
import dirs from '~/dirs';

const app = express();
const port = (process.env.PORT || 8080);
app.use(express.static(dirs.public));

if (process.env.NODE_ENV !== 'production') {
  // Dev env
  const webpack = require('webpack');
  const webpackDevMiddleware = require('webpack-dev-middleware');
  const webpackHotMiddleware = require('webpack-hot-middleware');
  const config = require('../webpack.dev.config.js');
  const compiler = webpack(config);

  const middleware = webpackDevMiddleware(compiler, {
    contentBase: dirs.src,
    port,
    inline: false,
    historyApiFallback: true,
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
      chunkModules: false,
    },
  });

  app.use(middleware);
  app.use(webpackHotMiddleware(compiler));
} else {
  app.use(express.static(dirs.dist));
}

app.get('*', (_, res) => { res.sendFile(dirs.index); });
app.listen(port);
