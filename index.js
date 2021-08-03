/* eslint-disable import/no-unresolved */
import * as BackgroundFetch from 'expo-background-fetch';
import * as TaskManager from 'expo-task-manager';
import watch from 'redux-watch';
import { AppRegistry } from 'react-native';
import { actions } from './store/stateReducer';
import 'react-native-gesture-handler';
// eslint-disable-next-line import/extensions
import App from './App';
import { name as appName } from './app.json';
import store from './store';
import appState from './classes';
import API from './classes/api';
import { BackgroundJobType } from './classes/types';
import { registerBackgroundFetchAsync } from './utils';

TaskManager.defineTask(BackgroundJobType.TASKLIST, async () => {
  try {
    const { withState } = await appState;
    await withState(
      async (state) =>
        API.executeScheduledTask(state)
          .then((ste) => ste)
          .catch(() => state),
      `background-job/${BackgroundJobType.TASKLIST}`
    );
  } catch (err) {
    console.error(
      'Error occuring while running scheduled tasklist',
      err.message
    );
  } finally {
    await registerBackgroundFetchAsync(BackgroundJobType.TASKLIST);
  }
  return BackgroundFetch.Result.NewData;
});

registerBackgroundFetchAsync(BackgroundJobType.TASKLIST);
appState.then(({ getState, saveState, onStateSaved }) => {
  const initiator = 'redux/state';
  store.dispatch(actions.setState(getState()));
  onStateSaved((ste, init) => {
    if (init !== initiator) {
      store.dispatch(actions.setState(ste));
    }
  });
  const stateWatcher = watch(() => store.getState(), 'state');
  store.subscribe(
    stateWatcher((nextState) => {
      saveState(nextState, initiator).catch(() => {});
    })
  );
});

AppRegistry.registerComponent(appName, () => App);
