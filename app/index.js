import 'babel-polyfill';
import React from 'react';
import { render } from 'react-dom';
import Root from 'containers/Root';

window.BaseRouter = {
  init: function init(mountpoint) {
    render(
      <Root />,
      document.getElementById(mountpoint)
    );
  },
};
