/* eslint-disable no-param-reassign */
import metaData, { MetaData } from './metaData';

type ReportResponse = {
  success: string[];
  failed: string[];
  message: string[];
};
export interface Report extends MetaData {
  result: ReportResponse;
}

export type ServerReportResponse = {
  status: 'running' | 'done';
  report?: ReportResponse;
};

export default (() => {
  function formatRunning(response: ServerReportResponse) {
    return { success: [], failed: [], message: [`Status: ${response.status}`] };
  }
  function formatFinished(response: ReportResponse | undefined) {
    const result: ReportResponse = {
      success: [],
      failed: [],
      message: [`No report generated from the server`],
    };
    if (!response) return result;
    const comparator = (a: string, b: string) => {
      if (a < b) return -1;
      if (a > b) return 1;
      return 0;
    };
    const process = (arr: string[]) =>
      arr.sort(comparator).map((line) => line.replace('>', ' > '));
    result.success = process(response.success);
    result.failed = process(response.failed);
    result.message = response.message;
    return result;
  }
  function format(response: ServerReportResponse) {
    return response.status === 'running'
      ? formatRunning(response)
      : formatFinished(response.report);
  }
  return {
    makeReport(): Report {
      return {
        ...metaData.makeMetaData('Report'),
        result: { success: [], failed: [], message: [] },
      };
    },

    update(report: Report, response: ServerReportResponse) {
      report.result = format(response);
    },
  };
})();
