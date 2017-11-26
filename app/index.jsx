import 'babel-polyfill';
import React from 'react';
import { render } from 'react-dom';
import ReactGA from 'react-ga';

import Root from '~/components/Root.jsx';

window.BaseRouter = {
  init: function init(mountpoint) {
    let debug = false;
    render(
      <Root />,
      document.getElementById(mountpoint),
    );

    if (module.hot) {
      debug = true;
      ReactGA.initialize('UA-108091199-1', { debug });
      module.hot.accept('./components/Root.jsx', () => {
        const NewRoot = require('./components/Root.jsx').default;
        render(
          <NewRoot />,
          document.getElementById(mountpoint),
        );
      });
      return;
    }
    ReactGA.initialize('UA-108091199-1', { debug });
  },
};
window.BaseRouter.init('root');
