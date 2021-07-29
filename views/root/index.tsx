import React, { FC } from 'react';
import { useToken } from 'native-base';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { TabsParamList } from './type';
import Home from './home';
import Schedule from './schedule';
import SettingsView from './settings';
import User from './User';
import Icon from '../components/Icon';
import style from '../style';
import iconsNames from '../iconsNames';

const tabBarIcon =
  (name: string) => (props: { size: number; focused: boolean }) => {
    const { size, focused } = props;
    return (
      <Icon.Icon
        name={name}
        color={!focused ? 'dark.20' : 'primary.500'}
        size={size}
      />
    );
  };
const Tabs = createBottomTabNavigator<TabsParamList>();
const Root: FC = () => {
  const color = useToken('colors', 'primary.500', '#000');
  return (
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
        name="Schedule"
        component={Schedule}
        options={{
          tabBarIcon: tabBarIcon(iconsNames.clock),
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
  );
};

export default Root;
