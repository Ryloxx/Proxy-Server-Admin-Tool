import { Report } from '../../../classes/report';

export type HomeParamList = {
  'Task Lists': undefined;
  Details: { id: string };
  Report: { reportData: Report };
  'Report List': { id: string };
  'Task Maker': { id: string };
};
