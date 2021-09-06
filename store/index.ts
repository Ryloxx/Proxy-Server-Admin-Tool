import { configureStore } from '@reduxjs/toolkit';
import uiReducer, { ignore } from './uiReducer';
import stateReducer from './stateReducer';

const store = configureStore({
  reducer: {
    ui: uiReducer,
    state: stateReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActionPaths: [...ignore.actions], // Ignore these paths in the state
        ignoredPaths: [...ignore.state], // Ignore these paths in the state
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type StateConfigIgnore = {
  actions: string[];
  state: string[];
};
export default store;
