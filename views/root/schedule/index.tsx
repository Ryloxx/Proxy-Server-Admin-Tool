import {
  createStackNavigator,
  TransitionPresets,
} from '@react-navigation/stack';
import React, { FC } from 'react';
import Layout from '../../components/Layout';
import { TabsNavigationRouteProps } from '../../type';
import { TabsParamList } from '../type';
import ScheduledTaskListPickView from './ScheduledTaskListPickView';
import ScheduledTaskListSettings from './ScheduledTaskListSettings';
import ScheduledTaskListView from './ScheduledTaskListView';
import { ScheduleStackParamList } from './type';

const ScheduleStack = createStackNavigator<ScheduleStackParamList>();

const Schedule: FC<TabsNavigationRouteProps<TabsParamList, 'Schedule'>> =
  () => (
    <>
      <ScheduleStack.Navigator headerMode="none">
        <ScheduleStack.Screen name="Scheduled Task">
          {({ navigation, route }) => (
            <Layout.LayoutTabDefault
              navigation={navigation}
              route={route}
              name={route.name}
              bgColor="yellow.20"
            >
              <ScheduledTaskListView navigation={navigation} route={route} />
            </Layout.LayoutTabDefault>
          )}
        </ScheduleStack.Screen>
        <ScheduleStack.Screen
          name="PickTaskList"
          options={{
            ...TransitionPresets.RevealFromBottomAndroid,
          }}
        >
          {({ navigation, route }) => {
            const color = 'light.100';
            return (
              <Layout.LayoutModalStackItem
                name="Choose a task list"
                navigation={navigation}
                route={route}
                bgColor="red.100"
                color={color}
              >
                <ScheduledTaskListPickView
                  navigation={navigation}
                  route={route}
                />
              </Layout.LayoutModalStackItem>
            );
          }}
        </ScheduleStack.Screen>
        <ScheduleStack.Screen name="ScheduleTaskList">
          {({ navigation, route }) => {
            const color = 'light.100';
            return (
              <Layout.LayoutFocusStackItem
                name="Schedule Settings"
                navigation={navigation}
                route={route}
                bgColor="red.100"
                color={color}
              >
                <ScheduledTaskListSettings
                  navigation={navigation}
                  route={route}
                />
              </Layout.LayoutFocusStackItem>
            );
          }}
        </ScheduleStack.Screen>
      </ScheduleStack.Navigator>
    </>
  );

export default Schedule;
