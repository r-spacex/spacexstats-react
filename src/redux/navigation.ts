import ReactGA from 'react-ga';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { scrollTo } from 'utils/scroll';
import { RootState } from './types';

/**
 * @type NavigationState
 * @description Tracks the active sub-tab for each major feature section on the dashboard.
 * A string value represents the active tab name, while null means no specific tab is selected.
 */
export type NavigationState = Readonly<{
  upcoming: string | null;
  launchhistory: string | null;
  recovery: string | null;
  reuse: string | null;
  payloads: string | null;
  dragon: string | null;
  people: string | null;
  starlink: string | null;
  starship: string | null;
  timelines: string | null;
  about: string | null;
}>;

// Default initial state where no tabs are active on page load
const initialState: NavigationState = {
  upcoming: null,
  launchhistory: null,
  recovery: null,
  reuse: null,
  payloads: null,
  dragon: null,
  people: null,
  starlink: null,
  starship: null,
  timelines: null,
  about: null,
};

// Extracts key names from the state structure to create a strict union type of section IDs
export type SectionId = keyof NavigationState;
export const sections = Object.keys(initialState) as SectionId[];

/**
 * @slice navigationSlice
 * @description Redux Toolkit slice responsible for managing dashboard tab states,
 * smooth window auto-scrolling, and recording user navigation metrics via Google Analytics.
 */
export const { actions, reducer } = createSlice({
  name: 'navigation',
  initialState,
  reducers: {
    /**
     * @reducer changeTab
     * @description Updates the active active sub-tab view inside a specific section.
     * @param payload.section - The target feature category (e.g., 'starlink', 'starship')
     * @param payload.tab - The target tab identifier string to set active
     */
    changeTab: (
      state,
      { payload }: PayloadAction<{ section: SectionId; tab: string }>,
    ) => ({
      ...state,
      // Fall back to null if the action payload passes an undefined tab value
      [payload.section]: payload.tab !== undefined ? payload.tab : null,
    }),

    /**
     * @reducer navigateTo
     * @description Triggers a viewport scroll to a target section element and dispatches hit events to Google Analytics.
     * @param payload.section - DOM target ID string to scroll towards
     * @param payload.down - Direction flag tracking layout trajectory (true = down, false = up)
     */
    navigateTo: (
      state,
      { payload }: PayloadAction<{ section: SectionId; down: boolean }>,
    ) => {
      // Execute helper wrapper to programmatically move viewport focal point
      scrollTo(payload.section);

      // Track interaction engagement metrics using global tracking engine instances
      ReactGA.event({
        category: 'Scroll Arrow',
        action: payload.down ? 'Scroll down' : 'Scroll up',
        label: payload.section,
      });

      return state;
    },
  },
});

/**
 * @selector selectCurrentTab
 * @description State selector querying the active sub-tab string configuration index for a specific section.
 * @param section - target section property identifier key
 * @returns string value indicating matching active sub-tab viewport or null state
 */
export const selectCurrentTab =
  (section: SectionId) =>
  (state: RootState): string | null =>
    state.navigation[section];
