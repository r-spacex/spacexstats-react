import React from 'react';
import { Provider } from 'react-redux';

import createStore from 'redux/createStore';

const store = createStore();

const AppWithProvider = ({ element }) => (
  <Provider store={store}>{element}</Provider>
);

export default AppWithProvider;
