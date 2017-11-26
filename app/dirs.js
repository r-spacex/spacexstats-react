const path = require('path');

module.exports = {
  src: __dirname,
  main: path.join(__dirname, 'index.jsx'),
  dist: path.join(__dirname, '../dist'),
  index: path.join(__dirname, '../dist/index.html'),
  public: path.join(__dirname, '../public'),
  favicon: path.join(__dirname, '../public/img/favicon.png'),
};
