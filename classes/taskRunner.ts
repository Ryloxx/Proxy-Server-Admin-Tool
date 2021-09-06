import ConnectionManager from './connectionManager';
import type { Report as ReportType } from './report';
import ReportHandler from './report';
import { TaskList } from './taskList';
import {
  ClientTasklistRunRequestBody,
  ClientTasklistRunRequestResponse,
} from './types';

export default class TaskRunner {
  static POLL_TIMEOUT = 3000;

  private connection: ConnectionManager;

  constructor(connection: ConnectionManager) {
    this.connection = connection;
  }

  async run(
    taskList: TaskList,
    {
      stopOnError,
      onProgress,
    }: {
      stopOnError: boolean;
      onProgress?: (
        key: string,
        currentTask: string,
        report: ReportType,
        done: boolean
      ) => void;
    }
  ) {
    const parsedTasksList = taskList.tasks.map((task) => task.typeId.split(''));
    const body: ClientTasklistRunRequestBody = {
      stopOnError,
      taskList: parsedTasksList,
    };
    const key = await this.connection.send<string>('/tasks/run', body);
    const report = ReportHandler.makeReport();
    await this.connection.poll<ClientTasklistRunRequestResponse>(
      `/tasks/progress/${key}`,
      (progress) => {
        ReportHandler.update(report, progress);
        if (typeof onProgress === 'function') {
          onProgress(key, progress.current, report, progress.done);
        }
        return !progress.done;
      }
    );

    return report;
  }
}
