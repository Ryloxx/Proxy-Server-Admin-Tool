import React, { FC } from 'react';
import { useSelector } from 'react-redux';
import { selectors } from '../../../store/stateReducer';
import { timeToDate } from '../../../utils';
import Layout from '../../components/Layout';

const TaskList: FC<{ id: string; color: string }> = ({ id, color }) => {
  const { createdAt, lastTimeRun, tasks } = useSelector(
    selectors.selectTaskList(id)
  );

  const lines: [string, string][] = [
    ['Task count', `${tasks.length}`],
    ['Created', `${timeToDate(createdAt)}`],
    lastTimeRun
      ? ['Last time run', `${timeToDate(lastTimeRun, true)}`]
      : ['', 'Never run'],
  ];

  return <Layout.SideInfoLayout lines={lines} color={color} />;
};
const ReportList: FC<{ id: string; color: string }> = ({ id, color }) => {
  const { reports } = useSelector(selectors.selectTaskList(id));

  const lines: [string, string][] = [['Reports count', `${reports.length}`]];

  return <Layout.SideInfoLayout lines={lines} color={color} />;
};

export default {
  TaskList,
  ReportList,
};
