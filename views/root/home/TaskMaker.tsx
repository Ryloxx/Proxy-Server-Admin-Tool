import { Text } from 'native-base';
import React, { FC, useContext, useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { TaskMapServerResponse } from '../../../classes/types';
import { actions } from '../../../store/stateReducer';
import Loader from '../../components/Loader';
import NestedSelect, { Node } from '../../components/NestedSelect';
import { useRequest } from '../../hooks';
import { ApiContext } from '../../providers/ApiProvider';
import { StackNavigationRouteProps } from '../../type';
import { HomeParamList } from './type';

function makeMap(taskTypeMap: TaskMapServerResponse) {
  const result: Node = {};
  Object.entries(taskTypeMap).forEach(([code, line]) => {
    const keys = line.split('>');
    let current: Record<string, {}> = result;
    const last = keys.pop();
    if (last) {
      keys.forEach((key: string) => {
        if (!(key in current)) {
          current[key] = {};
        }
        current = current[key];
      });
      current[last] = code;
    }
  });
  return result;
}

const TaskMaker: FC<StackNavigationRouteProps<HomeParamList, 'Task Maker'>> = ({
  route,
  navigation,
}) => {
  const api = useContext(ApiContext);
  const { id } = route.params;
  const dispatch = useDispatch();
  const [typeMap, setTypeMap] = useState<TaskMapServerResponse>();
  const { loading, error, send } = useRequest(
    () => api.getTaskTypeMap(),
    (result) => setTypeMap(result)
  );
  useEffect(() => {
    send();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const paths = useMemo(() => (typeMap ? makeMap(typeMap) : {}), [typeMap]);
  return (
    <Loader loading={loading} error={error}>
      {typeMap ? (
        <NestedSelect
          paths={paths}
          onSelect={(typeId) => {
            dispatch(
              actions.addTaskToTaskList({
                taskListId: id,
                typeId,
                typeMap,
              })
            );
            navigation.navigate('Details', { id });
          }}
        />
      ) : (
        <Text>Invalid type map provided</Text>
      )}
    </Loader>
  );
};
export default TaskMaker;
