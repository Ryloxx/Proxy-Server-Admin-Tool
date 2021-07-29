import React, { FC } from 'react';
import { useSelector } from 'react-redux';
import { StackNavigationRouteProps } from '../../type';
import { HomeParamList } from './type';
import { selectors } from '../../../store/stateReducer';
import List from '../../components/List';
import ListItem from '../../components/ListItem';
import { timeToDate } from '../../../utils';
import iconsNames from '../../iconsNames';
import TextType from '../../components/TextType';

const reportListEmptyText = `Reports will be listed here after each task list's run`;

const ReportListView: FC<
  StackNavigationRouteProps<HomeParamList, 'Report List'>
> = ({ navigation, route }) => {
  const { id } = route.params;

  const { reports } = useSelector(selectors.selectTaskList(id));
  return (
    <List
      emptyElement={<TextType.Info chunk>{reportListEmptyText}</TextType.Info>}
      data={reports}
      keyExtractor={(item) => item.createdAt}
      renderItem={(item) => (
        <ListItem.Small
          main="Report"
          image={iconsNames.page}
          sub={timeToDate(item.createdAt, true)}
          onPress={() => {
            navigation.navigate('Report', {
              reportData: item,
            });
          }}
        />
      )}
    />
  );
};

export default ReportListView;
