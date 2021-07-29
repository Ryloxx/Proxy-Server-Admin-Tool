/* eslint-disable no-param-reassign */
import { TaskList } from './taskList';

export enum ScheduleIntervalType {
  HOURLY,
  DAILY,
  MONTHLY,
}
export interface ScheduledTaskList {
  taskListId: string;
  startTime: number;
  interval: ScheduleIntervalType;
}
export interface TaskListManager {
  taskListList: Record<string, TaskList>;
  scheduledTaskList: Record<string, ScheduledTaskList>;
}
export default (() => ({
  makeTaskListManager(): TaskListManager {
    return {
      taskListList: {},
      scheduledTaskList: {},
    };
  },
  scheduleTaskList(
    taskListManager: TaskListManager,
    taskListId: string,
    interval: ScheduleIntervalType,
    startTime: number
  ): void {
    if (!(taskListId in taskListManager.taskListList)) {
      throw new Error('Unknown task list id');
    }
    taskListManager.scheduledTaskList[taskListId] = {
      interval,
      startTime,
      taskListId,
    };
  },
  unScheduleTaskList(taskListManager: TaskListManager, taskListId: string) {
    delete taskListManager.scheduledTaskList[taskListId];
  },
  addTaskList(
    taskListManager: TaskListManager,
    taskList: TaskList,
    replace = false
  ): void {
    if (!replace && taskList.id in taskListManager.taskListList) {
      throw new Error(
        'This tasklist manager contains already a task list with the same id'
      );
    }
    taskListManager.taskListList[taskList.id] = taskList;
  },
  removeTaskList(taskListManager: TaskListManager, taskListId: string) {
    delete taskListManager.taskListList[taskListId];
    this.unScheduleTaskList(taskListManager, taskListId);
  },
  getTaskList(taskListManager: TaskListManager, taskListId: string) {
    return taskListManager.taskListList[taskListId];
  },
  getScheduleInfo(taskListManager: TaskListManager, taskListId: string) {
    return taskListManager.scheduledTaskList[taskListId];
  },
  getTaskListList(taskListManager: TaskListManager) {
    return taskListManager.taskListList;
  },
  getTaskListScheduleInfoList(taskListManager: TaskListManager) {
    return taskListManager.scheduledTaskList;
  },
}))();
