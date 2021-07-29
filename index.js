/* eslint-disable import/no-unresolved */
import BackgroundJob from 'react-native-background-job';
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

const job = async () => {
  const { withState } = await appState;
  await withState(
    async (state) =>
      API.executeScheduledTask(state)
        .then((ste) => ste)
        .catch(() => state),
    `background-job/${BackgroundJobType.TASKLIST}`
  );
};
const backgroundJob = {
  jobKey: BackgroundJobType.TASKLIST,
  job,
};
BackgroundJob.register(backgroundJob);

const backgroundSchedule = {
  jobKey: BackgroundJobType.TASKLIST,
  period: 1000 * 60 * 15,
  allowExecutionInForeground: true,
  allowWhileIdle: true,
  networkType: 1,
};
BackgroundJob.schedule(backgroundSchedule).catch((err) =>
  console.error('error scheduleded task list', err.message)
);

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
