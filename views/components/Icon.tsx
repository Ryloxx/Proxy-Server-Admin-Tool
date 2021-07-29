import { Center, Circle, useToken } from 'native-base';
import React, { FC } from 'react';
import { TouchableNativeFeedback } from 'react-native';
// @ts-ignore
import Ic from 'react-native-vector-icons/FontAwesome5';

type IconProps = {
  size?: number;
  color?: string;
  name: string;
};
interface IconButtonProps extends IconProps {
  onPress: () => void;
  disabled?: boolean;
  wrapperSizeMultiplier?: number;
}
const Icon: FC<IconProps> = ({ name, color = 'dark.100', size }) => {
  const rcolor = useToken('colors', color);
  return <Ic name={name} color={rcolor} size={size} />;
};

const IconButton: FC<IconButtonProps> = ({
  name,
  color,
  size = 32,
  wrapperSizeMultiplier = 1.45,
  disabled,
  onPress,
}) => (
  <Circle
    overflow="hidden"
    m={2}
    width={size * wrapperSizeMultiplier}
    height={size * wrapperSizeMultiplier}
  >
    <TouchableNativeFeedback
      disabled={disabled}
      onPress={() => {
        onPress();
      }}
    >
      <Center
        width={size * wrapperSizeMultiplier}
        height={size * wrapperSizeMultiplier}
      >
        <Icon name={name} color={color} size={size} />
      </Center>
    </TouchableNativeFeedback>
  </Circle>
);

export default { IconButton, Icon };
