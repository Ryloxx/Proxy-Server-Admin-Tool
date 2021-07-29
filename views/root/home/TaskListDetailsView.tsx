import React, { FC, useContext } from 'react';
import { Button } from 'native-base';
import { useDispatch, useSelector } from 'react-redux';
import List from '../../components/List';
import { StackNavigationRouteProps } from '../../type';
import { HomeParamList } from './type';
import { ApiContext } from '../../providers/ApiProvider';
import { actions, selectors } from '../../../store/stateReducer';
import { useRequest } from '../../hooks';
import ListItem from '../../components/ListItem';
import iconsNames from '../../iconsNames';
import Error from '../../components/Error';
import { timeToDate } from '../../../utils';

const TaskListDetailsView: FC<
  StackNavigationRouteProps<HomeParamList, 'Details'>
> = ({ navigation, route }) => {
  const { id } = route.params;
  const api = useContext(ApiContext);
  const taskList = useSelector(selectors.selectTaskList(id));
  const dispatch = useDispatch();
  const {
    loading,
    error,
    send: run,
  } = useRequest(
    () => api.runTaskList(taskList),
    (result) => {
      dispatch(
        actions.setTaskList({
          ...taskList,
          lastTimeRun: Date.now(),
          reports: taskList.reports.concat([result]),
        })
      );
      navigation.navigate('Report', {
        reportData: result,
      });
    }
  );
  return (
    <>
      <List
        keyExtractor={(item) => item.id}
        data={taskList.tasks}
        renderItem={(item) => (
          <ListItem.Small
            longPressBackgroundProps={{
              actions: [
                [
                  iconsNames.trash,
                  'Delete',
                  () => {
                    dispatch(
                      actions.deleteTaskFromTaskList({
                        taskId: item.id,
                        taskListId: id,
                      })
                    );
                  },
                ],
              ],
            }}
            main={item.typeName.replace(/>/g, ' > ')}
            sub={`${timeToDate(item.createdAt)}`}
            image={iconsNames.chevronRight}
            imageColor="red.100"
          />
        )}
      />
      <Error.ErrorText>{error}</Error.ErrorText>
      <Button
        onPress={() => {
          navigation.navigate('Task Maker', {
            id,
          });
        }}
      >
        Add Task
      </Button>
      <Button
        onPress={() => {
          navigation.navigate('Report List', {
            id,
          });
        }}
      >
        Report List
      </Button>
      <Button
        isLoading={loading}
        onPress={() => {
          run();
        }}
      >
        Run
      </Button>
    </>
  );
};

export default TaskListDetailsView;
