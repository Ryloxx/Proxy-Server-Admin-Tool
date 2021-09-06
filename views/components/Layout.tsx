/* eslint-disable react/jsx-props-no-spreading */
import { ParamListBase } from '@react-navigation/native';
import {
  Box,
  Center,
  Divider,
  HStack,
  IBoxProps,
  ScrollView,
  Text,
  useBreakpointValue,
  VStack,
} from 'native-base';
import { useWindowDimensions } from 'react-native';
import React, { FC, PropsWithChildren } from 'react';
import { IHStackProps } from 'native-base/lib/typescript/components/primitives/Stack/HStack';
import Icon from './Icon';
import { StackNavigationRouteProps, TabsNavigationRouteProps } from '../type';
import iconsNames from '../iconsNames';

const STACK_HEADER_HEGIHT = 160;

interface LayoutProps {
  color?: string;
  bgColor?: string;
  name: string;
}
export type SideInfoLayoutProps = {
  lines: [string, string][];
  color?: string;
};
type SideInfoLayoutFC = FC<SideInfoLayoutProps>;

type SideInfoLayoutElement = ReturnType<SideInfoLayoutFC>;

export interface LayoutFocusStackItemProps<
  T extends ParamListBase,
  S extends keyof T
> extends StackNavigationRouteProps<T, S>,
    LayoutProps {
  side?: SideInfoLayoutElement;
  top?: string;
}

export interface LayoutTabDefaultProps<
  T extends ParamListBase,
  S extends keyof T
> extends TabsNavigationRouteProps<T, S>,
    LayoutProps {
  mat?: boolean;
}

/* BRICKS */

const SideInfoLayout: SideInfoLayoutFC = ({ lines, color }) =>
  lines.length ? (
    <Box>
      {lines
        .filter(([label, text]) => !!label || !!text)
        .map(([label, text]) => (
          <Box key={text}>
            {!!label && (
              <Text textAlign="right" fontSize="xs" color={color}>
                {label}
              </Text>
            )}
            {!!text && (
              <Text
                textAlign="right"
                fontSize="sm"
                fontWeight="bold"
                color={color}
                pl={1}
              >
                {text}
              </Text>
            )}
          </Box>
        ))}
    </Box>
  ) : null;

const BigLabel: FC<IBoxProps & { textColor: string }> = ({
  children,
  textColor,
  ...props
}) => (
  <Box flex={1} p={5} {...props}>
    <Text fontSize="5xl" fontWeight="bold" color={textColor}>
      {children}
    </Text>
  </Box>
);
const AlignedBigLabelWithSide: FC<
  IHStackProps & {
    main: string;
    textColor: string;
    sideWidth: number;
    side: SideInfoLayoutElement;
  }
> = ({ main, side, sideWidth, textColor, ...props }) => (
  <HStack {...props}>
    <BigLabel textColor={textColor} flex={1} p={5}>
      {main}
    </BigLabel>
    <Box p={5} pb={8} maxWidth={sideWidth}>
      {side}
    </Box>
  </HStack>
);

/* BUILDERS */

const LayoutFocusStackItem: <T extends ParamListBase, S extends keyof T>(
  props: PropsWithChildren<LayoutFocusStackItemProps<T, S>>
) => ReturnType<FC<LayoutFocusStackItemProps<T, S>>> = ({
  name,
  color = 'dark.100',
  bgColor = 'light.100',
  children,
  top,
  navigation,
  side,
}) => {
  const sideWidth = useBreakpointValue({
    base: 200,
    md: 300,
  });
  const { height } = useWindowDimensions();
  return (
    <ScrollView flex={1}>
      <VStack minHeight={height} bg={bgColor}>
        <Box minH={STACK_HEADER_HEGIHT}>
          <VStack flex={1}>
            <HStack alignItems="center">
              <Icon.IconButton
                onPress={() => {
                  navigation.goBack();
                }}
                name={iconsNames.prev}
                size={30}
                color={color}
              />
              {!!top && (
                <>
                  <Divider height={45} orientation="vertical" bg={color} />
                  <Text
                    flex={1}
                    pr={2}
                    fontSize="xs"
                    color={color}
                    fontWeight="bold"
                    textAlign="center"
                  >
                    {top}
                  </Text>
                </>
              )}
            </HStack>
            {side ? (
              <AlignedBigLabelWithSide
                main={name}
                side={side}
                sideWidth={sideWidth}
                textColor={color}
                alignItems="flex-end"
              />
            ) : (
              <BigLabel textColor={color}>{name}</BigLabel>
            )}
          </VStack>
        </Box>
        <Box bg="light.100" flex={1} borderTopRadius={30} px={4} pt={5} pb={2}>
          {children}
        </Box>
      </VStack>
    </ScrollView>
  );
};

const LayoutModalStackItem: <T extends ParamListBase, S extends keyof T>(
  props: PropsWithChildren<LayoutFocusStackItemProps<T, S>>
) => ReturnType<FC<LayoutFocusStackItemProps<T, S>>> = ({
  name,
  children,
  navigation,
}) => {
  const color = 'dark.100';
  const mainHead = (
    <HStack flex={1} alignItems="center" justifyContent="space-between">
      <Box mx={5}>
        <Text fontSize="xl" fontWeight="bold" color={color}>
          {name}
        </Text>
      </Box>
      <Icon.IconButton
        onPress={() => {
          navigation.goBack();
        }}
        name={iconsNames.close}
        size={30}
        color={color}
      />
    </HStack>
  );

  return (
    <ScrollView>
      <Center>
        <VStack width="80%" mt={10} borderRadius="xl">
          <Box borderBottomWidth={1} height={50}>
            {mainHead}
          </Box>
          <Box flex={1}>{children}</Box>
        </VStack>
      </Center>
    </ScrollView>
  );
};

const LayoutTabDefault: <T extends ParamListBase, S extends keyof T>(
  props: PropsWithChildren<LayoutTabDefaultProps<T, S>>
) => ReturnType<FC<LayoutTabDefaultProps<T, S>>> = ({
  name,
  color = 'dark.100',
  mat = false,
  bgColor = 'transparent',
  children,
}) => {
  const { height } = useWindowDimensions();

  return (
    <ScrollView bg={mat ? bgColor : undefined} px={2} pb={2}>
      <VStack minHeight={height}>
        <HStack
          alignContent="center"
          alignItems="center"
          direction="row"
          minHeight={150}
          padding={5}
          bg={
            mat
              ? bgColor
              : {
                  linearGradient: {
                    colors: [bgColor, 'transparent'],
                    start: [0, 0],
                    end: [0, 1],
                  },
                }
          }
        >
          <Center flex={1}>
            <Text
              color={color}
              fontSize="4xl"
              fontWeight="light"
              bg="transparent"
            >
              {name}
            </Text>
          </Center>
        </HStack>
        <Box flex={1}>{children}</Box>
      </VStack>
    </ScrollView>
  );
};

export default {
  BigLabel,
  AlignedBigLabelWithSide,
  LayoutTabDefault,
  LayoutFocusStackItem,
  SideInfoLayout,
  LayoutModalStackItem,
};
