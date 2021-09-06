import { EventRegister } from 'react-native-event-listeners';
import { InitialState } from '.';
import ConnectionManager from './connectionManager';
import { Report } from './report';
import { TaskList } from './taskList';
import taskListManager, { ScheduleIntervalType } from './taskListManager';
import TaskRunner from './taskRunner';
import { SettingsFields, TaskMapServerResponse, Times } from './types';

function parseScheduledTaskList(state: InitialState) {
  const scheduledTaskList = taskListManager.getTaskListScheduleInfoList(
    state.taskListManager
  );
  const time = new Date();
  const result: string[] = [];
  Object.entries(scheduledTaskList).forEach(([id, taskList]) => {
    const { lastTimeRun = 0 } = taskListManager.getTaskList(
      state.taskListManager,
      id
    );

    const { interval } = taskList;
    let bool = false;
    switch (interval) {
      case ScheduleIntervalType.HOURLY: {
        bool = time.getTime() - lastTimeRun >= Times.HOUR;
        break;
      }
      case ScheduleIntervalType.DAILY: {
        bool = time.getTime() - lastTimeRun >= Times.DAY;
        break;
      }
      case ScheduleIntervalType.MONTHLY: {
        bool = time.getTime() - lastTimeRun >= Times.MONTH;
        break;
      }
      default:
    }
    if (bool) {
      result.push(id);
    }
  });
  return result;
}

export default class API {
  connectionManager: ConnectionManager;

  settings;

  initialized: Promise<void> = Promise.resolve();

  constructor(settings: SettingsFields) {
    this.settings = settings;
    const { connection } = API.init(settings);
    this.connectionManager = connection;
    this.initialized = this.connectionManager.init;
  }

  init() {
    return this.initialized.catch(() => this.initialize());
  }

  initialize() {
    const { connection } = API.init(this.settings);
    this.connectionManager = connection;
    this.initialized = this.connectionManager.init;
    return this.initialized;
  }

  async login() {
    await this.init();
    await this.connectionManager.login();
    const user = await this.getUserData();
    EventRegister.emit('userchange', user);
  }

  async signup(signupInfo: {
    username: string;
    password: string;
    creds: string;
    email: string;
  }) {
    await this.init();
    await this.connectionManager.send('/signup', signupInfo);
  }

  async getUserData(): Promise<{ username: string; email: string }> {
    await this.init();
    return this.connectionManager.get('/user');
  }

  async runTaskList(
    taskList: TaskList,
    onProgress?: (
      key: string,
      currentTask: string,
      report: Report,
      done: boolean
    ) => void
  ) {
    await this.init();
    const runner = new TaskRunner(this.connectionManager);
    const report = await runner.run(taskList, {
      onProgress,
      stopOnError: this.settings.stopTaskListOnError,
    });
    return report;
  }

  async getTaskTypeMap() {
    await this.init();
    await this.connectionManager.login();
    return this.connectionManager.get<TaskMapServerResponse>('/tasks');
  }

  private static init(settings: SettingsFields) {
    const connection = new ConnectionManager(
      settings.apiUrl,
      settings.adminEndpoint,
      settings.versionEndpoint,
      settings.version,
      settings.username,
      settings.password
    );
    return {
      connection,
    };
  }

  static async executeScheduledTask(state: InitialState) {
    const parsedScheduledTask = parseScheduledTaskList(state);
    async function processTaskList(taskListId: string, runner: TaskRunner) {
      const taskList = taskListManager.getTaskList(
        state.taskListManager,
        taskListId
      );
      const report = await runner.run(taskList, {
        stopOnError: state.settings.stopTaskListOnError,
      });
      taskList.reports.push(report);
      taskList.lastTimeRun = Date.now();
    }
    if (parsedScheduledTask.length) {
      const { connection } = API.init(state.settings);
      await connection.init;
      await connection.login();
      const runner = new TaskRunner(connection);
      // eslint-disable-next-line no-restricted-syntax
      for (const tl of parsedScheduledTask) {
        // eslint-disable-next-line no-await-in-loop
        await processTaskList(tl, runner);
      }
    }
    return state;
  }
}
