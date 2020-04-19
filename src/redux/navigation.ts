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
  about: string | null;
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
  about: null,
};

export type SectionId = keyof NavigationState;
export const sections = Object.keys(initialState) as SectionId[];

export const { actions, reducer } = createSlice({
  name: 'navigation',
  initialState,
  reducers: {
    changeTab: (
      state,
      { payload }: PayloadAction<{ section: SectionId; tab: string }>,
    ) => ({
      ...state,
      [payload.section]: payload.tab !== undefined ? payload.tab : null,
    }),
    navigateTo: (
      state,
      { payload }: PayloadAction<{ section: SectionId; down: boolean }>,
    ) => {
      scrollTo(payload.section);

      ReactGA.event({
        category: 'Scroll Arrow',
        action: payload.down ? 'Scroll down' : 'Scroll up',
        label: payload.section,
      });

      return state;
    },
  },
});

export const selectCurrentTab = (section: SectionId) => (
  state: RootState,
): string | null => state.navigation[section];
