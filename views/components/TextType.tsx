/* eslint-disable react/jsx-props-no-spreading */
import { Center, HStack, ITextProps, Text } from 'native-base';
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

const SubHeader: FC<{ icon?: Element } & ITextProps> = ({
  icon,
  children,
  ...props
}) => (
  <HStack space={2}>
    {!!icon && <Center>{icon}</Center>}

    <Text {...props} fontWeight={600} fontSize={20}>
      {children}
    </Text>
  </HStack>
);

const TextMain: FC<ITextProps> = (props) => (
  <Text {...props} fontWeight="semi-bold" fontSize="md" />
);
const TextMainSub: FC<ITextProps> = (props) => (
  <Text {...props} fontWeight="medium" fontSize="md" />
);
const TextSub: FC<ITextProps> = (props) => (
  <Text {...props} fontWeight="medium" fontSize="sm" />
);
const TextSubSub: FC<ITextProps> = (props) => (
  <Text {...props} fontWeight="medium" fontSize="sm" />
);

export default {
  Info,
  SubHeader,
  TextMain,
  TextSub,
  TextMainSub,
  TextSubSub,
};
