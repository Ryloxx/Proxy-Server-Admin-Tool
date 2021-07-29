import { getUniqueId } from '../utils';
import metaData, { MetaData } from './metaData';
import { TaskMapServerResponse } from './types';

export interface Task extends MetaData {
  id: string;
  typeId: string;
  typeName: string;
}
export default {
  makeTask(typeId: string, typeMap: TaskMapServerResponse): Task {
    const typeName = typeMap[typeId];
    const id = getUniqueId();
    return {
      ...metaData.makeMetaData(`Task - ${id} - ${typeId} - ${typeName}`),
      id,
      typeId,
      typeName,
    };
  },
};
