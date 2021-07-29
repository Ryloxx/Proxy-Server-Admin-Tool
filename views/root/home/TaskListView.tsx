import React, { FC, useMemo } from 'react';
import { Button } from 'native-base';
import { useDispatch, useSelector } from 'react-redux';
import { actions, selectors } from '../../../store/stateReducer';
import List from '../../components/List';
import { StackNavigationRouteProps } from '../../type';
import { HomeParamList } from './type';
import ListItem from '../../components/ListItem';
import iconsNames from '../../iconsNames';
import { timeToDate } from '../../../utils';

const TaskListsView: FC<
  StackNavigationRouteProps<HomeParamList, 'Task Lists'>
> = ({ navigation }) => {
  const dispatch = useDispatch();
  const taskListList = useSelector(selectors.selectTaskListList);
  const data = useMemo(() => Object.values(taskListList), [taskListList]);

  return (
    <>
      <List
        keyExtractor={(item) => item.id}
        renderItem={(item) => (
          <ListItem.Basic
            onPress={() => {
              navigation.navigate('Details', {
                id: item.id,
              });
            }}
            longPressBackgroundProps={{
              actionsColor: 'light.100',
              backgroundColor: 'red.100',
              actions: [
                [
                  'trash-alt',
                  'Delete',
                  () => {
                    dispatch(actions.deleteTaskList({ taskListId: item.id }));
                  },
                ],
              ],
            }}
            main="Task List"
            image={iconsNames.burgerButton}
            sub={
              item.lastTimeRun
                ? `Last time run: ${timeToDate(item.lastTimeRun)}`
                : 'Never run'
            }
            mainSideColor="red.50"
            mainSide={`${timeToDate(item.createdAt)}`}
          />
        )}
        data={data}
      />
      <Button
        onPress={() => {
          dispatch(actions.createTaskList());
        }}
      >
        Add Task List
      </Button>
    </>
  );
};
export default TaskListsView;
