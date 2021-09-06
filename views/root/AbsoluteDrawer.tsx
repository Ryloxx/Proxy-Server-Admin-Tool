import {
  Box,
  Center,
  Collapse,
  Divider,
  Fade,
  HStack,
  Progress,
  ScrollView,
  Spinner,
  VStack,
} from 'native-base';
import React, { FC, useEffect, useRef, useState } from 'react';
import { TouchableNativeFeedback, useWindowDimensions } from 'react-native';
import { useSelector } from 'react-redux';
import { selectors } from '../../store/uiReducer';
import Icon from '../components/Icon';
import TextType from '../components/TextType';
import { drawer } from '../components/vars';
import iconsNames from '../iconsNames';

const Item: FC<{ taskKey: string }> = ({ taskKey }) => {
  const entry = useSelector(selectors.selectTopDrawerEntry(taskKey));
  if (!entry) {
    return null;
  }
  const { title, working, progress, subTitle, icon } = entry;

  const showProgress = typeof progress === 'number';

  return (
    <HStack space={2} w="100%" px={4} py={4}>
      <Box w="10%">
        {working || !icon ? (
          <Spinner
            color={drawer.BASE_ACCENT_COLOR}
            size={32}
            accessibilityLabel="Running Task"
            animating={working}
          />
        ) : (
          <Icon.Icon name={icon} color={drawer.BASE_ACCENT_COLOR} size={32} />
        )}
      </Box>
      <VStack space={2} flex={1} justifyContent="center">
        <TextType.TextMain color={drawer.BASE_COLOR}>{title}</TextType.TextMain>
        <Fade in={showProgress}>
          <Progress
            colorScheme={drawer.BASE_COLOR_SCHEME}
            rounded="0"
            size="xs"
            value={progress}
            m={1}
          />
        </Fade>
        <TextType.TextMainSub>{subTitle}</TextType.TextMainSub>
      </VStack>
    </HStack>
  );
};

export default function AbsoluteDrawer() {
  const topDrawerEntries = useSelector(selectors.selectTopDrawerEntries());
  const keys = Object.entries(topDrawerEntries)
    .sort(
      ([, { addedAt: addedAtA }], [, { addedAt: addedAtB }]) =>
        addedAtB - addedAtA // From recent to older
    )
    .map(([key]) => key);
  const [open, setOpen] = useState(false);
  const [fullOpen, setFullOpen] = useState(false);
  const seen = useRef(new Set());
  useEffect(() => {
    if (keys.every((key) => seen.current.has(key))) return;
    seen.current = new Set(keys);
    setOpen(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [topDrawerEntries]);

  const { height } = useWindowDimensions();

  return (
    <Box position="absolute" top={-1} left={0} right={0}>
      <Box zIndex={5} right={0} top={0} position="absolute">
        <Fade in key={`${open}`}>
          <Icon.IconButton
            onPress={() => {
              setOpen(!open);
            }}
            name={open ? iconsNames.arrowCircleUp : iconsNames.arrowCircleDown}
            size={32}
            color={open ? drawer.BASE_ACCENT_COLOR : 'rgba(0, 0, 0, 0.3)'}
          />
        </Fade>
      </Box>

      <Collapse
        duration={drawer.BASE_SLIDE_DURATION}
        bgColor={drawer.BASE_BG_COLOR}
        isOpen={open}
        endingHeight={fullOpen ? height * 0.78 : 150}
        shadow={9}
        roundedBottom="2xl"
      >
        {(fullOpen || keys.length > 2) && (
          <Box zIndex={5} right={0} bottom={0} position="absolute">
            <Fade in={open} key={`${fullOpen}`}>
              <Icon.IconButton
                onPress={() => {
                  setFullOpen(!fullOpen);
                }}
                name={
                  fullOpen
                    ? iconsNames.arrowCircleUp
                    : iconsNames.arrowCircleDown
                }
                size={32}
                color={drawer.BASE_ACCENT_COLOR}
              />
            </Fade>
          </Box>
        )}
        {keys.length ? (
          <ScrollView>
            <VStack>
              {keys.map((key, idx) => {
                const inner = (
                  <Fade in>
                    <Item taskKey={key} />
                    {keys.length - 1 !== idx && (
                      <Divider bgColor="rgba(0, 0, 0, 0.2)" w="100%" />
                    )}
                  </Fade>
                );
                const click = topDrawerEntries[key].onClick || null;
                const onPress = click
                  ? () => {
                      click();
                      setOpen(false);
                    }
                  : null;
                return (
                  <React.Fragment key={key}>
                    {onPress ? (
                      <TouchableNativeFeedback onPress={onPress}>
                        <Box>{inner}</Box>
                      </TouchableNativeFeedback>
                    ) : (
                      inner
                    )}
                  </React.Fragment>
                );
              })}
            </VStack>
          </ScrollView>
        ) : (
          <Center p={3}>
            <TextType.Info> No tasks</TextType.Info>
          </Center>
        )}
      </Collapse>
    </Box>
  );
}
