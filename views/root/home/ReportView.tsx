import { Center, Divider, VStack } from 'native-base';
import React, { FC, useMemo } from 'react';
import LabeledData from '../../components/LabeledData';
import TextType from '../../components/TextType';
import { StackNavigationRouteProps } from '../../type';
import { HomeParamList } from './type';

const ReportView: FC<StackNavigationRouteProps<HomeParamList, 'Report'>> = ({
  route,
}) => {
  const {
    reportData = {
      result: { message: ['Something went wrong'], failed: [], success: [] },
    },
  } = route.params;
  const {
    result: { failed, message, success },
  } = reportData;
  const data = useMemo(() => {
    const result = [];
    if (success.length) {
      result.push(['Success', success.join('\n')] as [string, string]);
    }
    if (failed.length) {
      result.push(['Failed', failed.join('\n')] as [string, string]);
    }
    return result;
  }, [failed, success]);

  if (!reportData) return <TextType.Info>Load report first</TextType.Info>;
  return (
    <VStack space={3} pt={3}>
      {!!data.length && <LabeledData data={data} />}
      <Center>
        <Divider width="90%" my={2} />
      </Center>
      <TextType.Info chunk>{message.join('\n')}</TextType.Info>
    </VStack>
  );
};

export default ReportView;
