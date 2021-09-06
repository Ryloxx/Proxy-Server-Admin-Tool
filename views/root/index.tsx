import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useToken } from 'native-base';
import React, { FC } from 'react';
import Icon from '../components/Icon';
import iconsNames from '../iconsNames';
import style from '../style';
import AbsoluteBottomDrawer from './AbsoluteDrawer';
import Home from './home';
import SettingsView from './settings';
import { TabsParamList } from './type';
import User from './User';

const tabBarIcon =
  (name: string) => (props: { size: number; focused: boolean }) => {
    const { size, focused } = props;
    return (
      <Icon.Icon
        name={name}
        color={!focused ? 'dark.20' : 'primary.500'}
        size={size * 0.8}
      />
    );
  };
const Tabs = createBottomTabNavigator<TabsParamList>();
const Root: FC = () => {
  const color = useToken('colors', 'primary.500', '#000');

  return (
    <>
      <Tabs.Navigator
        tabBarOptions={{
          showLabel: false,
          activeTintColor: color,
          style: {
            borderTopColor: style.borderColorBase,
            borderTopWidth: style.borderWidthThin,
            minHeight: 60,
            paddingBottom: 10,
            paddingTop: 10,
          },
        }}
      >
        <Tabs.Screen
          name="Home"
          component={Home}
          options={{
            tabBarIcon: tabBarIcon(iconsNames.house),
          }}
        />
        <Tabs.Screen
          name="Settings"
          component={SettingsView}
          options={{
            tabBarIcon: tabBarIcon(iconsNames.settings),
          }}
        />
        <Tabs.Screen
          name="User"
          component={User}
          options={{
            tabBarIcon: tabBarIcon(iconsNames.person),
          }}
        />
      </Tabs.Navigator>
      <AbsoluteBottomDrawer />
    </>
  );
};

export default Root;
