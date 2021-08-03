import { Text, Button, VStack, Box } from 'native-base';
import { Picker } from '@react-native-picker/picker';
import React, { FC, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ScheduleIntervalType } from '../../../classes/taskListManager';
import { actions, selectors } from '../../../store/stateReducer';
import { StackNavigationRouteProps } from '../../type';
import { HomeParamList } from './type';

const StartTimePicker: FC<{
  selectedValue: number;
  range: ScheduleIntervalType;
  onChange: (startTime: number) => any;
}> = ({ range, onChange, selectedValue }) => {
  const options = useMemo(() => {
    const result: Record<string, number> = {};
    switch (range) {
      case ScheduleIntervalType.HOURLY:
        Array(60)
          .fill(0)
          .forEach((_, idx) => {
            result[`${idx}`] = idx * 60 * 1000;
          });

        break;
      case ScheduleIntervalType.DAILY:
        Array(24)
          .fill(0)
          .forEach((_, idx) => {
            result[`${idx}:00`] = idx * 60 * 60 * 1000;
          });

        break;
      case ScheduleIntervalType.MONTHLY:
        Array(30)
          .fill(0)
          .forEach((_, idx) => {
            const oneIndexed = idx + 1;
            result[oneIndexed] = oneIndexed * 24 * 60 * 60 * 1000;
          });

        break;
      default:
    }
    return result;
  }, [range]);

  return (
    <Picker
      selectedValue={selectedValue}
      onValueChange={(itemValue) => {
        onChange(itemValue);
      }}
    >
      {Object.entries(options).map(([label, value]) => (
        <Picker.Item key={label} label={label} value={value} />
      ))}
    </Picker>
  );
};

const ScheduledTaskListSettings: FC<
  StackNavigationRouteProps<HomeParamList, 'ScheduleTaskList'>
> = ({ navigation, route }) => {
  const { id } = route.params;

  const dispatch = useDispatch();
  const scheduledTaskList = useSelector(selectors.selectScheduledTaskList(id));
  const taskList = useSelector(selectors.selectTaskList(id));
  const intervalMap = {
    [ScheduleIntervalType.DAILY]: 'day',
    [ScheduleIntervalType.HOURLY]: 'hour',
    [ScheduleIntervalType.MONTHLY]: 'month',
  };

  const [result, setResult] = useState({
    interval: scheduledTaskList?.interval || ScheduleIntervalType.HOURLY,
    startTime: scheduledTaskList?.startTime || 0,
  });
  if (!taskList) return <Text>Invalid TaskList</Text>;
  return (
    <VStack flex={1}>
      <Text textAlign="center" fontSize="xl" fontWeight="semibold">
        Run the task list each
      </Text>
      <Picker
        selectedValue={result.interval}
        onValueChange={(itemValue) => {
          result.interval = itemValue;
          setResult({ ...result, startTime: 0 });
        }}
      >
        <Picker.Item
          label={intervalMap[ScheduleIntervalType.HOURLY]}
          value={ScheduleIntervalType.HOURLY}
        />
        <Picker.Item
          label={intervalMap[ScheduleIntervalType.DAILY]}
          value={ScheduleIntervalType.DAILY}
        />
        <Picker.Item
          label={intervalMap[ScheduleIntervalType.MONTHLY]}
          value={ScheduleIntervalType.MONTHLY}
        />
      </Picker>
      {result.interval !== ScheduleIntervalType.HOURLY && (
        <>
          <Text textAlign="center" fontSize="xl" fontWeight="semibold">
            Run at
          </Text>
          <StartTimePicker
            selectedValue={result.startTime}
            range={result.interval}
            onChange={(startTime) => {
              result.startTime = startTime;
              setResult({ ...result });
            }}
          />
        </>
      )}
      <Box flex={1} />
      <Button
        onPress={() => {
          dispatch(
            actions.scheduleTaskList({
              interval: result.interval,
              startTime: result.startTime,
              taskListId: taskList.id,
            })
          );
          navigation.goBack();
        }}
      >
        {scheduledTaskList ? 'Update' : 'Create'}
      </Button>
    </VStack>
  );
};
export default ScheduledTaskListSettings;
