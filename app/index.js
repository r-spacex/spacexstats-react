import 'babel-polyfill';
import React from 'react';
import ReactGA from 'react-ga';
import { render } from 'react-dom';
import Root from 'components/Root';

window.BaseRouter = {
  init: function init(mountpoint) {
    let debug = false;
    render(
      <Root />,
      document.getElementById(mountpoint)
    );

    if (module.hot) {
      debug = true;
      module.hot.accept('components/Root', () => {
        const NewRoot = require('components/Root').default;
        render(
          <NewRoot />,
          document.getElementById(mountpoint)
        );
      });
    }
    ReactGA.initialize('UA-108091199-1', { debug });
  },
};
window.BaseRouter.init('root');
