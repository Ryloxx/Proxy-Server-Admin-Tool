import { Box, HStack } from 'native-base';
import React, { FC, useState } from 'react';
import iconsNames from '../iconsNames';
import Icon from './Icon';
import List from './List';
import ListItem from './ListItem';

type NestedSelectPaths<T> = Record<string, T | string>;
export interface Node extends NestedSelectPaths<Node> {}

const NestedSelect: FC<{
  paths: Node;
  onSelect: (typeId: string) => void;
}> = ({ paths, onSelect }) => {
  const [stack, setStack] = useState([paths]);
  const current = stack[stack.length - 1];
  const isStartingPoint = stack.length <= 1;

  return (
    <HStack>
      <Box flex={1}>
        <List
          data={Object.entries(current)}
          renderItem={(item) => {
            const [label, next] = item;
            return (
              <ListItem.Small
                image={
                  typeof next === 'string' ? iconsNames.dot : iconsNames.next
                }
                main={label}
                onPress={() => {
                  if (typeof next === 'string') {
                    onSelect(next);
                    return;
                  }
                  stack.push(next);
                  setStack([...stack]);
                }}
              />
            );
          }}
          keyExtractor={(item) => item[0]}
        />
      </Box>
      <Icon.IconButton
        name={isStartingPoint ? iconsNames.circle : iconsNames.prev}
        disabled={isStartingPoint}
        onPress={() => {
          if (!isStartingPoint) {
            stack.pop();
            setStack([...stack]);
          }
        }}
      />
    </HStack>
  );
};

export default NestedSelect;
