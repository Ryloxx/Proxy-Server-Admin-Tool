import { registerTaskAsync } from 'expo-background-fetch';
import uuid from 'react-native-uuid';

export async function wait(timeout: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, timeout);
  });
}

export function getUniqueId() {
  return <string>uuid.v4();
}

/* eslint-disable no-param-reassign */
export function mergeObject<T>(
  dest: T,
  source: Partial<T>,
  replace: boolean = false
) {
  if (replace) {
    dest = { ...dest, ...source };
    return dest;
  }
  Object.keys(source).forEach((key) => {
    if (key in dest) {
      // @ts-ignore
      dest[key] = source[key];
    }
  });
  return dest;
}
/* eslint-enable no-param-reassign */

export function timeToDate(time: number, precise = false) {
  return precise
    ? new Date(time).toLocaleString()
    : new Date(time).toLocaleDateString();
}

export async function registerBackgroundFetchAsync(type: string) {
  return registerTaskAsync(type, {
    minimumInterval: 60, // 15 minutes
    stopOnTerminate: false, // android only,
    startOnBoot: true, // android only
  });
}

export function makeBulletListText(list: string[], type: 'bullet' = 'bullet') {
  const typeMap = {
    bullet: '\u2022',
  };
  return list.map((item) => `${typeMap[type]} ${item}`);
}
