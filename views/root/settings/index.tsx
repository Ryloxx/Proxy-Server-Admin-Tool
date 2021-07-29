import React, { FC } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { TabsNavigationRouteProps } from '../../type';
import { TabsParamList } from '../type';
import Auth from './auth';
import Settings from './Settings';
import { SettingsStackParamList } from './type';
import Layout from '../../components/Layout';

const SettingsStack = createStackNavigator<SettingsStackParamList>();
const SettingsView: FC<TabsNavigationRouteProps<TabsParamList, 'Settings'>> =
  () => (
    <SettingsStack.Navigator headerMode="none">
      <SettingsStack.Screen name="Settings">
        {({ navigation, route }) => (
          <Layout.LayoutTabDefault
            name="Settings"
            navigation={navigation}
            route={route}
            bgColor="yellow.20"
          >
            <Settings navigation={navigation} route={route} />
          </Layout.LayoutTabDefault>
        )}
      </SettingsStack.Screen>
      <SettingsStack.Screen name="Auth" component={Auth} />
    </SettingsStack.Navigator>
  );

export default SettingsView;
