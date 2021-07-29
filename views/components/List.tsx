import React, { PropsWithChildren } from 'react';
import {
  List as NativeBaseList,
  Heading,
  Box,
  Text,
  VStack,
} from 'native-base';

interface ListProps<T> {
  heading?: string;
  data: T[];
  emptyElement?: Element;
  renderItem: (item: T, index: number) => Element;
  keyExtractor: (item: T, index: number) => string | number;
}

export default function List<T>({
  heading,
  renderItem,
  emptyElement = null,
  data,
  keyExtractor,
}: PropsWithChildren<ListProps<T>>) {
  return (
    <Box overflow="hidden">
      {heading && (
        <Heading px={2} py={4} fontSize={24}>
          <Text>{heading}</Text>
        </Heading>
      )}
      {!data.length ? (
        emptyElement
      ) : (
        <VStack my={2} py={0} space={2}>
          {data.map((item, index) => {
            const itm = renderItem(item, index);
            const key = keyExtractor(item, index);
            const child = (
              <NativeBaseList.Item key={key}>{itm}</NativeBaseList.Item>
            );

            return child;
          })}
        </VStack>
      )}
    </Box>
  );
}
