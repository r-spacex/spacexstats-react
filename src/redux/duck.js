import ReactGA from 'react-ga';
import { scrollTo, updateHash } from 'utils/scroll';

/* ===== Action types ===== */

const navigateToType = 'NAVIGATE_TO';

/* ===== Actions ===== */

const navigateTo = (anchor, down) => ({
  type: navigateToType,
  anchor,
  down,
});

export const actions = {
  navigateTo,
};

/* ===== Selectors ===== */

/* ===== Reducer ===== */

const initialState = {};

const reducer = (state = initialState, action = {}) => {
  switch (action.type) {
    case navigateToType:
      scrollTo(action.anchor);
      updateHash(action.anchor);

      ReactGA.event({
        category: 'Scroll Arrow',
        action: action.down ? 'Scroll down' : 'Scroll up',
        label: action.anchor,
      });
      break;

    default:
  }
  return state;
};

export default reducer;
