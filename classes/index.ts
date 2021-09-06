import storage from '@react-native-async-storage/async-storage';
import taskListManagerHandler, { TaskListManager } from './taskListManager';
import { SettingsFields, StorageKeyEntry } from './types';
import ConnectionManager from './connectionManager';

export type InitialState = {
  settings: SettingsFields;
  taskListManager: TaskListManager;
};
export function getInitialState(): InitialState {
  return {
    settings: {
      apiUrl: '',
      adminEndpoint: '/admin',
      versionEndpoint: '/',
      stopTaskListOnError: false,
      version: '',
      username: '',
      password: '',
    },
    taskListManager: taskListManagerHandler.makeTaskListManager(),
  };
}

const appState = (async () => {
  let disableStateSave = false;
  const handlers: ((
    state: InitialState,
    initiator: string
  ) => void | Promise<void>)[] = [];
  let state: InitialState = await storage
    .getItem(StorageKeyEntry.STATE)
    .then((result) => (result ? JSON.parse(result) : Promise.reject()))
    .catch(() => getInitialState());
  const getState = () => JSON.parse(JSON.stringify(state));

  const stateSave = async (ste: InitialState, initiator: string) => {
    await Promise.all(
      handlers.map(async (callback) => callback(getState(), initiator))
    );
  };
  const saveState = async (
    newState: Partial<InitialState>,
    initiator: string
  ) => {
    if (disableStateSave) {
      throw new Error('Forbbiden save');
    }
    disableStateSave = true;
    const nextState = { ...state, ...newState };
    await storage
      .setItem(StorageKeyEntry.STATE, JSON.stringify(nextState))
      .catch((err) => console.error('unable to save', err));
    state = nextState;
    stateSave(state, initiator);
    disableStateSave = false;
    return getState();
  };

  const withState = async (
    callback: (state: InitialState) => Promise<InitialState> | InitialState,
    initiator: string
  ) => {
    const newSte = await callback(getState());
    await saveState(newSte, initiator);
  };

  const onStateSaved = (
    callback: (state: InitialState, initiator: string) => void | Promise<void>
  ) => {
    handlers.push(callback);
  };

  const update = async () => {
    const { apiUrl, versionEndpoint } = state.settings;
    const serverVersion = await ConnectionManager.getServerVersion(
      `${apiUrl}${versionEndpoint}`
    );
    await saveState(
      {
        ...state,
        settings: {
          ...state.settings,
          version: serverVersion,
        },
        taskListManager: taskListManagerHandler.makeTaskListManager(),
      },
      'root'
    );
  };
  return {
    getState,
    withState,
    saveState,
    onStateSaved,
    update,
  };
})();

export default appState;
