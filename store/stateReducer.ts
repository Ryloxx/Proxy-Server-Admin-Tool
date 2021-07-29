import { createSlice, Draft, PayloadAction } from '@reduxjs/toolkit';
import task from '../classes/task';
import { getInitialState, InitialState } from '../classes/index';
import type { RootState } from '.';

import taskList, { TaskList } from '../classes/taskList';
import { mergeObject } from '../utils';
import { SettingsFields, TaskMapServerResponse } from '../classes/types';
import taskListManagerHandler, {
  ScheduledTaskList,
} from '../classes/taskListManager';

/* eslint-disable no-param-reassign */

function parseStateToState(
  state: Draft<ReturnType<typeof slice.reducer>>,
  stateToParse: InitialState
) {
  const { settings, taskListManager } = stateToParse;
  state.settings = settings;
  state.taskListManager = taskListManager;
}

const slice = createSlice({
  initialState: { ...getInitialState() },
  name: 'state',
  reducers: {
    updateSettings: (
      state,
      { payload }: PayloadAction<Partial<SettingsFields>>
    ) => {
      state.settings = mergeObject(state.settings, payload, true);
    },
    createTaskList(state) {
      const newTasklist = taskList.makeTaskList();
      taskListManagerHandler.addTaskList(state.taskListManager, newTasklist);
    },
    deleteTaskList(state, { payload }: PayloadAction<{ taskListId: string }>) {
      taskListManagerHandler.removeTaskList(
        state.taskListManager,
        payload.taskListId
      );
    },
    addTaskToTaskList(
      state,
      {
        payload: { taskListId, typeId, typeMap },
      }: PayloadAction<{
        taskListId: string;
        typeId: string;
        typeMap: TaskMapServerResponse;
      }>
    ) {
      const newTask = task.makeTask(typeId, typeMap);
      taskList.add(
        taskListManagerHandler.getTaskList(state.taskListManager, taskListId),
        newTask
      );
    },
    deleteTaskFromTaskList(
      state,
      {
        payload: { taskId, taskListId },
      }: PayloadAction<{ taskListId: string; taskId: string }>
    ) {
      taskList.delete(
        taskListManagerHandler.getTaskList(state.taskListManager, taskListId),
        taskId
      );
    },
    unScheduleTaskList: (
      state,
      { payload }: PayloadAction<{ taskListId: string }>
    ) => {
      taskListManagerHandler.unScheduleTaskList(
        state.taskListManager,
        payload.taskListId
      );
    },
    scheduleTaskList: (
      state,
      {
        payload: { interval, startTime, taskListId },
      }: PayloadAction<ScheduledTaskList>
    ) => {
      taskListManagerHandler.scheduleTaskList(
        state.taskListManager,
        taskListId,
        interval,
        startTime
      );
    },
    setTaskList: (state, { payload }: PayloadAction<TaskList>) => {
      taskListManagerHandler.addTaskList(state.taskListManager, payload, true);
    },
    setState: (state, { payload }: PayloadAction<InitialState>) => {
      parseStateToState(state, payload);
    },
  },
});

/* eslint-enable no-param-reassign */

export const selectors = {
  selectSettings: (state: RootState) => state.state.settings,
  selectTaskList: (id: string) => (state: RootState) =>
    taskListManagerHandler.getTaskList(state.state.taskListManager, id),
  selectScheduledTaskList: (id: string) => (state: RootState) =>
    taskListManagerHandler.getScheduleInfo(state.state.taskListManager, id),
  selectTaskListList: (state: RootState) =>
    taskListManagerHandler.getTaskListList(state.state.taskListManager),
  selectScheduledTaskListList: (state: RootState) =>
    taskListManagerHandler.getTaskListScheduleInfoList(
      state.state.taskListManager
    ),
};

export const { actions } = slice;
export default slice.reducer;
