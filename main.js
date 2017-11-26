require('babel-core/register');
const _ = require('lodash');
const ignoreStyles = require('ignore-styles');

ignoreStyles.default(['.css', '.styl', '.png', '.jpg'], (module, filename) => {
  if (_.some(['.png', '.jpg'], ext => filename.endsWith(ext))) {
    module.exports = filename.replace(/^.*\/img/, '/img'); // eslint-disable-line no-param-reassign
  }
});

require('./app/server.jsx');
