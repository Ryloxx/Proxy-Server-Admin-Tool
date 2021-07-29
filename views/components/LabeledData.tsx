import { HStack, Text, VStack } from 'native-base';
import React, { FC } from 'react';

const LabeledData: FC<{ data: [string, string][]; center?: boolean }> = ({
  data,
  center,
}) => (
  <VStack space={3}>
    {data.map(([label, value]) => (
      <HStack space={4} key={label}>
        <Text
          textAlign={center ? 'right' : undefined}
          flex={1}
          minW={50}
          fontWeight="semibold"
        >
          {label}
        </Text>
        <Text flex={8}>{value}</Text>
      </HStack>
    ))}
  </VStack>
);

export default LabeledData;
