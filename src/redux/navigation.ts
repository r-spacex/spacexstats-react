import ReactGA from 'react-ga';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { scrollTo, updateHash } from 'utils/scroll';
import { RootState } from './types';

export type NavigationState = Readonly<{
  upcoming: string | null;
  launchcount: string | null;
  launchhistory: string | null;
  launchpads: string | null;
  landing: string | null;
  reuse: string | null;
  turnarounds: string | null;
  payloads: string | null;
  dragon: string | null;
  people: string | null;
  starlink: string | null;
  starship: string | null;
  timelines: string | null;
  infos: string | null;
}>;

const initialState: NavigationState = {
  upcoming: null,
  launchcount: null,
  launchhistory: null,
  launchpads: null,
  landing: null,
  reuse: null,
  turnarounds: null,
  payloads: null,
  dragon: null,
  people: null,
  starlink: null,
  starship: null,
  timelines: null,
  infos: null,
};

export const sections = Object.keys(initialState);

export const { actions, reducer } = createSlice({
  name: 'navigation',
  initialState,
  reducers: {
    changeTab: (
      state,
      {
        payload,
      }: PayloadAction<{ section: keyof NavigationState; tab?: string }>,
    ) => ({
      ...state,
      [payload.section]: payload.tab !== undefined ? payload.tab : null,
    }),
    navigateTo: (
      state,
      { payload }: PayloadAction<{ section: string; down: boolean }>,
    ) => {
      scrollTo(payload.section);
      updateHash(payload.section);

      ReactGA.event({
        category: 'Scroll Arrow',
        action: payload.down ? 'Scroll down' : 'Scroll up',
        label: payload.section,
      });

      return initialState;
    },
  },
});

export const selectCurrentTab = (section: keyof NavigationState) => (
  state: RootState,
): string | null => state.navigation[section];
