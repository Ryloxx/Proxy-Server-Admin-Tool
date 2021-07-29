import React, { FC, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { StackNavigationRouteProps } from '../../type';
import { ScheduleStackParamList } from './type';
import List from '../../components/List';
import { selectors } from '../../../store/stateReducer';
import ListItem from '../../components/ListItem';
import iconsNames from '../../iconsNames';

const ScheduledTaskListPickView: FC<
  StackNavigationRouteProps<ScheduleStackParamList, 'PickTaskList'>
> = ({ navigation }) => {
  const taskListList = useSelector(selectors.selectTaskListList);
  const data = useMemo(() => Object.entries(taskListList), [taskListList]);

  return (
    <>
      <List
        keyExtractor={([, item]) => item.id}
        renderItem={([, item]) => (
          <ListItem.Small
            main={item.id}
            image={iconsNames.burgerButton}
            onPress={() => {
              navigation.navigate('ScheduleTaskList', {
                id: item.id,
              });
            }}
          />
        )}
        data={data}
      />
    </>
  );
};

export default ScheduledTaskListPickView;
