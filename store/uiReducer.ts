import { createSlice } from '@reduxjs/toolkit';
import type { RootState } from './index';
import { Report } from '../classes/report';

interface UIState {
  lastReport: Report | null;
}

const initialState: UIState = {
  lastReport: null,
};

const slice = createSlice({
  initialState,
  name: 'ui',
  reducers: {},
});

export const selectors = {
  selectLastReport: (state: RootState) => state.ui.lastReport,
};
export const { actions } = slice;
export default slice.reducer;
