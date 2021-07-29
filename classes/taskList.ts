import { getUniqueId } from '../utils';
import metaData, { MetaData } from './metaData';
import { Report } from './report';
import { Task } from './task';

export interface TaskList extends MetaData {
  id: string;
  lastTimeRun?: number;
  retry: number;
  reports: Report[];
  tasks: Task[];
}
export default {
  makeTaskList(): TaskList {
    const id = getUniqueId();
    return {
      ...metaData.makeMetaData(`Tasklist - ${id}`),
      id,
      lastTimeRun: undefined,
      retry: 0,
      reports: [],
      tasks: [],
    };
  },
  add: (taskList: TaskList, task: Task) => {
    taskList.tasks.push(task);
  },
  delete(taskList: TaskList, taskId: string) {
    const idx = taskList.tasks.findIndex((task) => task.id === taskId);
    if (idx >= 0) {
      taskList.tasks.splice(idx, 1);
    }
  },
};
