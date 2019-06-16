import { createStore as reduxCreateStore } from 'redux';
import reducer from './duck';

const createStore = () => reduxCreateStore(reducer);
export default createStore;
