import 'babel-polyfill';
import React from 'react';
import { render } from 'react-dom';
import Root from 'components/Root';

window.BaseRouter = {
  init: function init(mountpoint) {
    render(
      <Root />,
      document.getElementById(mountpoint)
    );

    if (module.hot) {
      module.hot.accept('components/Root', () => {
        const NewRoot = require('components/Root').default;
        render(
          <NewRoot />,
          document.getElementById(mountpoint)
        );
      });
    }
  },
};
