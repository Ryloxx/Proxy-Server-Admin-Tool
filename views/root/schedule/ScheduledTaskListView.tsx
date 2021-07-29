import React, { FC, useMemo } from 'react';
import { Button } from 'native-base';
import { useDispatch, useSelector } from 'react-redux';
import { actions, selectors } from '../../../store/stateReducer';
import List from '../../components/List';
import { StackNavigationRouteProps } from '../../type';
import { ScheduleStackParamList } from './type';
import ListItem from '../../components/ListItem';
import iconsNames from '../../iconsNames';
import { ScheduleIntervalType } from '../../../classes/taskListManager';

const parseScheduleType = (scheduleType: ScheduleIntervalType) => {
  switch (scheduleType) {
    case ScheduleIntervalType.HOURLY:
      return 'hour';
    case ScheduleIntervalType.DAILY:
      return 'day';
    case ScheduleIntervalType.MONTHLY:
      return 'month';
    default:
      return '';
  }
};

const ScheduledTaskListView: FC<
  StackNavigationRouteProps<ScheduleStackParamList, 'Scheduled Task'>
> = ({ navigation }) => {
  const scheduledTaskList = useSelector(selectors.selectScheduledTaskListList);
  const dispatch = useDispatch();
  const data = useMemo(
    () => Object.entries(scheduledTaskList),
    [scheduledTaskList]
  );

  return (
    <>
      <List
        keyExtractor={(item) => item[0]}
        renderItem={([id, info]) => (
          <ListItem.Basic
            longPressBackgroundProps={{
              actions: [
                [
                  iconsNames.trash,
                  'Delete',
                  () => {
                    dispatch(
                      actions.unScheduleTaskList({
                        taskListId: id,
                      })
                    );
                  },
                ],
              ],
            }}
            main={`Tasklist Id: ${info.taskListId}`}
            sub={`Every ${parseScheduleType(info.interval)}`}
            image={iconsNames.dot}
            onPress={() => {
              navigation.navigate('ScheduleTaskList', {
                id,
              });
            }}
          />
        )}
        data={data}
      />
      <Button
        onPress={() => {
          navigation.navigate('PickTaskList');
        }}
      >
        Add Schedule
      </Button>
    </>
  );
};

export default ScheduledTaskListView;
