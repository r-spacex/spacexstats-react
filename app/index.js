import '@babel/polyfill';
import React from 'react';
import { render } from 'react-dom';
import ReactGA from 'react-ga';

import Root from '~/components/Root.jsx';

render(<Root />, document.getElementById('root'));

ReactGA.initialize('UA-108091199-1');
