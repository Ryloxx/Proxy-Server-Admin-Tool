import { TaskList } from './taskList';
import { wait } from '../utils';
import ConnectionManager from './connectionManager';
import ReportHandler from './report';
import type { Report as ReportType, ServerReportResponse } from './report';
import { ClientTasklistRunRequestBody, ServerTaskRunResponse } from './types';

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
      onProgress?: (report: ReportType) => void;
    }
  ) {
    const parsedTasksList = taskList.tasks.map((task) => task.typeId.split(''));
    const body: ClientTasklistRunRequestBody = {
      stopOnError,
      taskList: parsedTasksList,
    };
    const progressId = await this.connection.send<ServerTaskRunResponse>(
      '/tasks/run',
      body
    );
    const poll = () =>
      this.connection.get<ServerReportResponse>(
        `/tasks/progress/${progressId}`
      );
    let progress = await poll();
    const report = ReportHandler.makeReport();
    ReportHandler.update(report, progress);
    /* eslint-disable no-await-in-loop */
    while (progress.status === 'running') {
      await wait(TaskRunner.POLL_TIMEOUT);
      progress = await poll();
      ReportHandler.update(report, progress);
      if (onProgress) {
        onProgress(report);
      }
    }
    /* eslint-enable no-await-in-loop */
    return report;
  }
}
