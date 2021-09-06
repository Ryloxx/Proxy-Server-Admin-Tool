export type TaskMapServerResponse = Record<string, string>;
export type VersionResponse = {
  version: string;
};

export enum StorageKeyEntry {
  STATE = 'state',
}
export enum BackgroundJobType {
  TASKLIST = 'tasklist',
}
export enum Times {
  MILLISECOND = 1,
  SECOND = 1000,
  MINUTE = 1000 * 60,
  HOUR = 1000 * 60 * 60,
  DAY = 1000 * 60 * 60 * 24,
  MONTH = 1000 * 60 * 60 * 24 * 30,
}

export interface SettingsFields {
  apiUrl: string;
  adminEndpoint: string;
  versionEndpoint: string;
  stopTaskListOnError: boolean;
  version: string;
  username: string;
  password: string;
}

export enum TaskStatus {
  SUCCESS = 0,
  FAILED = 1,
  PENDING = 2,
  SKIPPED = 3,
}

export type ClientRequestError = {
  error: string;
};
export type ClientTasklistRunRequestBody = {
  taskList: string[][];
  stopOnError: boolean;
};

export type ClientTasklistRunRequestResponse = {
  current: string;
  done: boolean;
  status: Record<string, { status: TaskStatus }>;
  message: string[];
};

export type ServerTaskRunResponse = number;
