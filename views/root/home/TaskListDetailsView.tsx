import { Box, Button, Divider, VStack } from 'native-base';
import React, { FC, useCallback, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ReportManager from '../../../classes/report';
import { ScheduleIntervalType } from '../../../classes/taskListManager';
import { actions, selectors } from '../../../store/stateReducer';
import { actions as uiActions } from '../../../store/uiReducer';
import { getUniqueId, timeToDate } from '../../../utils';
import Icon from '../../components/Icon';
import List from '../../components/List';
import ListItem from '../../components/ListItem';
import TextType from '../../components/TextType';
import iconsNames from '../../iconsNames';
import { ApiContext } from '../../providers/ApiProvider';
import { StackNavigationRouteProps } from '../../type';
import { HomeParamList } from './type';

const TaskListDetailsView: FC<
  StackNavigationRouteProps<HomeParamList, 'Details'>
> = ({ navigation, route }) => {
  const { id } = route.params;

  const scheduleInfo = useSelector(selectors.selectScheduledTaskList(id));
  const api = useContext(ApiContext);
  const taskList = useSelector(selectors.selectTaskList(id));
  const dispatch = useDispatch();
  const handleTaskRunStart = useCallback(
    async (key) => {
      dispatch(
        uiActions.updateTopDrawerEntry({
          key,
          title: 'Starting Task',
          working: false,
          subTitle: id,
        })
      );
      const result = await api.runTaskList(
        taskList,
        (k, currentTask, report, done) => {
          dispatch(
            uiActions.updateTopDrawerEntry({
              key,
              title: currentTask,
              working: true,
              subTitle: id,
              icon: done ? iconsNames.checkMarkCircle : undefined,
              onClick: () => {
                navigation.navigate('Report', {
                  reportData: { ...report },
                });
              },
              progress: ReportManager.getTotalProgress(report) * 100,
            })
          );
        }
      );
      return result;
    },
    [api, dispatch, id, navigation, taskList]
  );

  const handleTaskRunFinish = useCallback(
    (key, result) => {
      dispatch(
        uiActions.updateTopDrawerEntry({
          key,
          title: 'Done',
          working: false,
          subTitle: id,
          icon: iconsNames.checkMarkCircle,
          progress: undefined,
        })
      );
      dispatch(
        actions.setTaskList({
          ...taskList,
          lastTimeRun: Date.now(),
          reports: taskList.reports.concat([result]),
        })
      );
    },
    [dispatch, id, taskList]
  );

  const handleTaskRunError = useCallback(
    (key, error) => {
      dispatch(
        uiActions.updateTopDrawerEntry({
          key,
          title: 'Error',
          working: false,
          subTitle: `${id}\n- ${error}`,
          icon: iconsNames.crossError,
          progress: undefined,
        })
      );
    },
    [dispatch, id]
  );

  const handleTaskRun = async () => {
    const key = getUniqueId();
    try {
      const result = await handleTaskRunStart(key);
      handleTaskRunFinish(key, result);
    } catch (err: any) {
      handleTaskRunError(key, err.message);
    }
  };

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
        <Button onPress={handleTaskRun}>Run</Button>
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
