import React, { FC, useContext } from 'react';
import { Box, Button, Divider, VStack } from 'native-base';
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
import Icon from '../../components/Icon';
import { ScheduleIntervalType } from '../../../classes/taskListManager';
import TextType from '../../components/TextType';

const TaskListDetailsView: FC<
  StackNavigationRouteProps<HomeParamList, 'Details'>
> = ({ navigation, route }) => {
  const { id } = route.params;

  const scheduleInfo = useSelector(selectors.selectScheduledTaskList(id));
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
    <VStack flex={1}>
      <Box flex={1}>
        <List
          emptyElement={
            <TextType.Info chunk>Add new task to be run</TextType.Info>
          }
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
      </Box>
      <Error.ErrorText>{error}</Error.ErrorText>
      <Button.Group direction="column" justifyContent="center">
        <Button.Group>
          <Button
            flex={1}
            onPress={() => {
              navigation.navigate('Task Maker', {
                id,
              });
            }}
          >
            Add Task
          </Button>
          <Button
            flex={1}
            onPress={() => {
              navigation.navigate('Report List', {
                id,
              });
            }}
          >
            Report List
          </Button>
        </Button.Group>
        <Button
          isLoading={loading}
          onPress={() => {
            run();
          }}
        >
          Run
        </Button>
      </Button.Group>
      <Divider />
      <Button.Group alignItems="center" minH={20}>
        <Icon.IconButton
          name={scheduleInfo ? iconsNames.trash : iconsNames.clock}
          onPress={() => {
            if (scheduleInfo) {
              dispatch(
                actions.unScheduleTaskList({
                  taskListId: id,
                })
              );
            } else {
              dispatch(
                actions.scheduleTaskList({
                  interval: ScheduleIntervalType.HOURLY,
                  startTime: 0,
                  taskListId: id,
                })
              );
            }
          }}
        />
        {scheduleInfo ? (
          <Button
            flex={1}
            onPress={() => {
              navigation.navigate('ScheduleTaskList', {
                id,
              });
            }}
          >
            Update Schedule
          </Button>
        ) : (
          <Box flex={1} />
        )}
      </Button.Group>
    </VStack>
  );
};

export default TaskListDetailsView;
