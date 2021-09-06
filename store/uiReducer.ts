/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState, StateConfigIgnore } from './index';

type TopDrawerEntry = {
  key: string;
  addedAt: number;
  working: boolean;
  title: string;
  progress?: number;
  subTitle?: string;
  icon?: string;
  onClick?: () => void;
};

interface UIState {
  topDrawer: Record<string, TopDrawerEntry>;
}

const initialState: UIState = {
  topDrawer: {},
};

const slice = createSlice({
  initialState,
  name: 'ui',
  reducers: {
    updateTopDrawerEntry: (
      state,
      { payload }: PayloadAction<Omit<TopDrawerEntry, 'addedAt'>>
    ) => {
      const addedAt = Date.now();
      const base = state.topDrawer[payload.key] || {};
      state.topDrawer[payload.key] = {
        // @ts-ignore => the goal is to overwrite with the earliest time
        addedAt,
        ...base,
        ...payload,
      };
    },
  },
});

export const selectors = {
  selectTopDrawerEntry: (key: string) => (state: RootState) =>
    state.ui.topDrawer[key] || null,
  selectTopDrawerEntries: () => (state: RootState) => state.ui.topDrawer,
};
export const { actions } = slice;

export const ignore: StateConfigIgnore = {
  actions: ['payload.onClick'],
  state: ['ui.topDrawer'],
};
export default slice.reducer;
