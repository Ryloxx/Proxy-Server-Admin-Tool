/* eslint-disable react/jsx-props-no-spreading */
import React, { FC } from 'react';
import { Button, IButtonProps } from 'native-base';

interface ButtonProps extends IButtonProps {
  mainColor: string;
  textColor: string;
  shallow?: boolean;
}

interface CustomizedButtonProps
  extends Omit<ButtonProps, 'mainColor' | 'textColor'> {}

const Base: FC<ButtonProps> = ({
  mainColor,
  textColor,
  children,
  shallow,
  ...props
}) => (
  <Button
    variant={shallow ? 'ghost' : 'solid'}
    bg={!shallow ? mainColor : 'transparent'}
    borderColor={mainColor}
    _text={{
      color: shallow ? mainColor : textColor,
    }}
    {...props}
  >
    {children}
  </Button>
);

const Info: FC<CustomizedButtonProps> = (props) => (
  <Base {...props} mainColor="blue.100" textColor="light.100" />
);
const Dangerouse: FC<CustomizedButtonProps> = (props) => (
  <Base {...props} mainColor="red.200" textColor="light.100" />
);

export default {
  Base,
  Info,
  Dangerouse,
};
