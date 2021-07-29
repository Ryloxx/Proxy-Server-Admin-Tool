import { configureStore } from '@reduxjs/toolkit';
import uiReducer from './uiReducer';
import stateReducer from './stateReducer';

const store = configureStore({
  reducer: {
    ui: uiReducer,
    state: stateReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export default store;
