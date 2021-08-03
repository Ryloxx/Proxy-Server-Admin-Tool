import {
  Box,
  Center,
  Circle,
  FlatList,
  Flex,
  HStack,
  Text,
  useToken,
} from 'native-base';
import React, { FC, useState } from 'react';
import { TouchableNativeFeedback } from 'react-native';
import iconsNames from '../iconsNames';
import Icon from './Icon';
import { Dimension } from './types';
import { listItem } from './vars';

const getIconDimension = (size: number) => ({
  wrapperSize: size * 0.9,
  iconSize: size * 0.55,
});

type WithSideProps = {
  subSide?: string;
  subSideColor?: string;
  mainSide?: string;
  mainSideColor?: string;
};
type WithFontProps = {
  mainFontWeight?: string;
  mainSideFontWeight?: string;
};
type WithDimensionProps = {
  dimension?: Dimension;
};
type WithBackgroundActionsProps = {
  actions: [string, string, () => void][];
  actionsColor?: string;
  backgroundColor?: string;
};

interface BackgroundActionProps
  extends WithBackgroundActionsProps,
    WithDimensionProps {
  onClose: () => void;
}

interface ListItemProps
  extends WithSideProps,
    WithDimensionProps,
    WithFontProps {
  sub?: string;
  rounded?: boolean;
  subColor?: string;
  main: string;
  mainColor?: string;
  image?: string;
  imageBg?: string;
  imageColor?: string;
  longPressBackgroundProps?: WithBackgroundActionsProps;
  onPress?: () => void;
}

type OnlyContentEditable = Omit<
  ListItemProps,
  keyof WithSideProps | keyof WithDimensionProps | keyof WithFontProps
>;

interface SmallListItemProps extends OnlyContentEditable {}

interface LargeListItemProps extends OnlyContentEditable {}

const ListItemBackground: FC<BackgroundActionProps> = ({
  actions,
  onClose,
  backgroundColor = listItem.BASE_BG_BG_COLOR,
  dimension,
  actionsColor = listItem.BASE_BG_COLOR,
}) => {
  const iconSize = getIconDimension(dimension?.height || listItem.BASE_SIDE);
  return (
    <HStack justifyContent="space-between" bg={backgroundColor} flex={1}>
      <Center
        bg={actionsColor}
        borderWidth={1}
        borderLeftRadius="2xl"
        borderRightWidth={0}
        borderColor={backgroundColor}
      >
        <Icon.IconButton
          wrapperSizeMultiplier={2}
          onPress={() => {
            onClose();
          }}
          name={iconsNames.prev}
          size={iconSize.iconSize}
          color={backgroundColor}
        />
      </Center>
      <Box flex={99999} />
      <FlatList
        horizontal
        data={actions}
        keyExtractor={(item) => item[2]}
        renderItem={({ item: action }) => {
          const [iconName, , callback] = action;
          return (
            <HStack borderRadius="md" alignItems="center" space={2} px={3}>
              <Circle bg={actionsColor}>
                <Icon.IconButton
                  wrapperSizeMultiplier={1.4}
                  onPress={() => {
                    if (callback) {
                      callback();
                    }
                  }}
                  name={iconName}
                  color={backgroundColor}
                  size={iconSize.iconSize}
                />
              </Circle>
            </HStack>
          );
        }}
      />
    </HStack>
  );
};

const ListItem: FC<ListItemProps> = ({
  main,
  mainColor = '',
  mainSide = '',
  rounded = true,
  mainSideColor = mainColor,
  sub = '',
  subColor = 'dark.20',
  subSide = '',
  subSideColor,
  mainSideFontWeight = 'medium',
  mainFontWeight = 'semibold',
  image = '',
  dimension = {
    minHeight: 90,
  },
  imageColor = listItem.BASE_COLOR,
  imageBg = listItem.BASE_IMAGE_BG,
  longPressBackgroundProps,
  onPress,
}) => {
  const [hasMainSide, hasSub, hasSubSide, hasImage] = [
    !!mainSide,
    !!sub,
    !!subSide,
    !!image,
  ];
  const imageTokenColor = useToken('colors', imageColor);
  const [showBackground, setShowBackground] = useState(false);
  const iconSize = getIconDimension(dimension.height || listItem.BASE_SIDE);
  const foreGround = (
    <HStack p={2} flex={1} alignItems="center" space={1}>
      {hasImage && (
        <Center
          bg={imageBg}
          padding={1}
          borderRadius="2xl"
          width={iconSize.wrapperSize}
          height={iconSize.wrapperSize}
        >
          <Icon.Icon
            name={image}
            size={iconSize.iconSize}
            color={imageTokenColor}
          />
        </Center>
      )}
      <Box ml={2} flex={1}>
        <Flex justifyContent="space-between" direction="row">
          <Text
            color={mainColor}
            fontWeight={mainFontWeight}
            fontSize="md"
            numberOfLines={1}
          >
            {main}
          </Text>

          {hasMainSide && (
            <Text
              color={mainSideColor}
              fontWeight={mainSideFontWeight}
              fontSize="md"
            >
              {mainSide}
            </Text>
          )}
        </Flex>
        {hasSub && (
          <Flex justifyContent="space-between" wrap="wrap" direction="row">
            <Text color={subColor} fontWeight="medium" fontSize="sm">
              {sub}
            </Text>
            {hasSubSide && (
              <Text fontWeight="medium" fontSize="sm" color={subSideColor}>
                {subSide}
              </Text>
            )}
          </Flex>
        )}
      </Box>
    </HStack>
  );
  let item = (
    <Box
      width={dimension.width}
      height={dimension.height}
      minHeight={dimension.minHeight}
      minWidth={dimension.minWidth}
    >
      {showBackground && longPressBackgroundProps ? (
        <ListItemBackground
          actionsColor={longPressBackgroundProps.actionsColor}
          backgroundColor={longPressBackgroundProps.backgroundColor}
          onClose={() => {
            setShowBackground(false);
          }}
          dimension={dimension}
          actions={longPressBackgroundProps.actions}
        />
      ) : (
        foreGround
      )}
    </Box>
  );

  if (onPress || longPressBackgroundProps) {
    item = (
      <TouchableNativeFeedback
        onPress={() => {
          if (!showBackground && onPress) onPress();
        }}
        onLongPress={() => {
          if (longPressBackgroundProps) {
            setShowBackground(true);
          }
        }}
      >
        {item}
      </TouchableNativeFeedback>
    );
  }
  return (
    <Box borderRadius={rounded ? '2xl' : undefined} flex={1} overflow="hidden">
      {item}
    </Box>
  );
};
const Small: FC<SmallListItemProps> = ({
  main,
  image,
  imageBg,
  imageColor,
  mainColor,
  longPressBackgroundProps,
  onPress,
  sub,
  subColor,
}) => (
  <ListItem
    main={main}
    sub={sub}
    subColor={subColor}
    image={image}
    imageColor={imageColor}
    imageBg={imageBg}
    mainColor={mainColor}
    onPress={onPress}
    longPressBackgroundProps={longPressBackgroundProps}
    dimension={{
      height: 50,
      minHeight: 70,
      minWidth: '100%',
    }}
    mainFontWeight="bold"
    mainSideFontWeight="light"
  />
);

const Large: FC<LargeListItemProps> = ({
  main,
  image,
  imageBg,
  imageColor,
  mainColor,
  longPressBackgroundProps,
  onPress,
  sub,
  subColor,
  rounded = false,
  children,
}) => (
  <HStack>
    <Box flex={1}>
      <ListItem
        main={main}
        sub={sub}
        subColor={subColor}
        image={image}
        imageColor={imageColor}
        imageBg={imageBg}
        rounded={rounded}
        mainColor={mainColor}
        onPress={onPress}
        longPressBackgroundProps={longPressBackgroundProps}
        dimension={{
          minHeight: 90,
          minWidth: '100%',
        }}
        mainFontWeight="extrabold"
        mainSideFontWeight="light"
      />
    </Box>
    {!!children && <Center p={2}>{children}</Center>}
  </HStack>
);
const Basic = ListItem;

export default {
  Small,
  Basic,
  Large,
};
