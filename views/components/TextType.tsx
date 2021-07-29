import { Center, Text } from 'native-base';
import React, { FC } from 'react';

const Info: FC<{ chunk?: boolean }> = ({ chunk, children }) => {
  if (chunk) {
    return (
      <Center minH={200}>
        <Text color="blue.100" fontSize="xl" fontWeight="semibold">
          {children}
        </Text>
      </Center>
    );
  }
  return <Text color="blue.100">{children}</Text>;
};

export default {
  Info,
};
