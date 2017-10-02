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

    if (module.hot) {
      module.hot.accept('containers/Root', () => {
        const NewRoot = require('containers/Root').default;
        render(
          <NewRoot />,
          document.getElementById(mountpoint)
        );
      });
    }
  },
};
