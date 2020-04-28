import { combineReducers, createStore as reduxCreateStore } from 'redux';
import { reducer as navigationReducer } from './navigation';

export const rootReducer = combineReducers({
  navigation: navigationReducer,
});

const createStore = () => reduxCreateStore(rootReducer);

export default createStore;
