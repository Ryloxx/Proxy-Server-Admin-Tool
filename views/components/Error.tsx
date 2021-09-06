import { Fade, ITextProps, Text } from 'native-base';
import React, { FC } from 'react';

const ErrorText: FC<ITextProps> = ({ children, ...props }) => (
  <Fade in={!!children}>
    {/* eslint-disable-next-line react/jsx-props-no-spreading */}
    <Text m={3} fontWeight="bold" {...props} color="red.200">
      {children}
    </Text>
  </Fade>
);

export default {
  ErrorText,
};
