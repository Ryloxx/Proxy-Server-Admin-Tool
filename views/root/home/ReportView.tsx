import { Box, Center, Divider, HStack, Text, VStack } from 'native-base';
import React, { FC, useMemo } from 'react';
import Icon from '../../components/Icon';
import TextType from '../../components/TextType';
import iconsNames from '../../iconsNames';
import { StackNavigationRouteProps } from '../../type';
import { HomeParamList } from './type';

const ReportView: FC<StackNavigationRouteProps<HomeParamList, 'Report'>> = ({
  route,
}) => {
  const {
    reportData = {
      result: {
        message: ['Something went wrong'],
        failed: [],
        success: [],
        pending: [],
        skipped: [],
      },
    },
  } = route.params;
  const {
    result: { failed, message, success, pending, skipped },
  } = reportData;
  const data = useMemo(() => {
    const result = [];
    if (success.length) {
      result.push([
        'Success',
        success,
        iconsNames.checkMarkCircle,
        'green.100',
      ] as [string, string[], string, string]);
    }
    if (failed.length) {
      result.push(['Failed', failed, iconsNames.close, 'red.100'] as [
        string,
        string[],
        string,
        string
      ]);
    }
    if (skipped.length) {
      result.push(['Skipped', skipped, iconsNames.skippArrows, 'dark.20'] as [
        string,
        string[],
        string,
        string
      ]);
    }
    if (pending.length) {
      result.push(['Pending', pending, iconsNames.hourglass, 'yellow.100'] as [
        string,
        string[],
        string,
        string
      ]);
    }

    return result;
  }, [failed, success, pending, skipped]);

  if (!reportData) return <TextType.Info>Load report first</TextType.Info>;
  return (
    <VStack space={3} pt={3}>
      {!!data.length && (
        <VStack space={3}>
          {data.map(([title, names, icon, color]) => {
            if (!names.length) return null;
            return (
              <Box key={title}>
                <TextType.SubHeader
                  icon={<Icon.Icon name={icon} size={20} color={color} />}
                >
                  {title}
                </TextType.SubHeader>
                <VStack space={1} pl={2}>
                  {names.map((name) => (
                    <HStack space={1} key={name}>
                      <Text>-</Text>
                      <Text>{name}</Text>
                    </HStack>
                  ))}
                </VStack>
              </Box>
            );
          })}
          <Center>
            <Divider width="90%" my={2} />
          </Center>
        </VStack>
      )}
      <TextType.Info chunk>{message.join('\n')}</TextType.Info>
    </VStack>
  );
};

export default ReportView;
