/* eslint-disable no-param-reassign */
import metaData, { MetaData } from './metaData';
import { TaskStatus } from './types';

type ReportResponse = {
  success: string[];
  failed: string[];
  pending: string[];
  skipped: string[];
  message: string[];
};
export interface Report extends MetaData {
  result: ReportResponse;
}

export type ServerReportResponse = {
  status: Record<string, { status: TaskStatus }>;
  message: string[];
};

export default (() => {
  function format(response: ServerReportResponse): ReportResponse {
    const result: ReportResponse = {
      failed: [],
      success: [],
      pending: [],
      skipped: [],
      message: response.message,
    };
    const m: Record<TaskStatus, keyof typeof result> = {
      [TaskStatus.FAILED]: 'failed',
      [TaskStatus.PENDING]: 'pending',
      [TaskStatus.SKIPPED]: 'skipped',
      [TaskStatus.SUCCESS]: 'success',
    };
    Object.entries(response.status).forEach(([name, { status }]) => {
      result[m[status]].push(name);
    });
    return result;
  }
  return {
    makeReport(): Report {
      return {
        ...metaData.makeMetaData('Report'),
        result: {
          success: [],
          failed: [],
          pending: [],
          skipped: [],
          message: [],
        },
      };
    },

    update(report: Report, response: ServerReportResponse) {
      report.result = format(response);
    },
    getTotalProgress(report: Report) {
      const total =
        report.result.failed.length +
        report.result.pending.length +
        report.result.skipped.length +
        report.result.success.length;
      return total - report.result.pending.length;
    },
  };
})();
