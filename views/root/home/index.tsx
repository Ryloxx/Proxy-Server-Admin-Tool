import {
  createStackNavigator,
  TransitionPresets,
} from '@react-navigation/stack';
import { Box } from 'native-base';
import React, { FC } from 'react';
import Layout from '../../components/Layout';

import { TabsNavigationRouteProps } from '../../type';
import { TabsParamList } from '../type';
import ReportListView from './ReportListView';
import ReportView from './ReportView';
import SideInfo from './SideInfo';
import TaskListDetailsView from './TaskListDetailsView';
import TaskListsView from './TaskListView';
import TaskMaker from './TaskMaker';
import { HomeParamList } from './type';

const HomeStack = createStackNavigator<HomeParamList>();

const Home: FC<TabsNavigationRouteProps<TabsParamList, 'Home'>> = () => (
  <Box flex={1}>
    <HomeStack.Navigator headerMode="none">
      <HomeStack.Screen name="Task Lists">
        {({ navigation, route }) => (
          <Layout.LayoutTabDefault
            navigation={navigation}
            route={route}
            name={route.name}
            bgColor="yellow.20"
          >
            <TaskListsView navigation={navigation} route={route} />
          </Layout.LayoutTabDefault>
        )}
      </HomeStack.Screen>
      <HomeStack.Screen name="Details">
        {({ navigation, route }) => {
          const color = 'light.100';
          return (
            <Layout.LayoutFocusStackItem
              top={`id - ${route.params.id}`}
              name="Task List Details"
              navigation={navigation}
              route={route}
              side={<SideInfo.TaskList id={route.params.id} color={color} />}
              bgColor="red.100"
              color={color}
            >
              <TaskListDetailsView navigation={navigation} route={route} />
            </Layout.LayoutFocusStackItem>
          );
        }}
      </HomeStack.Screen>
      <HomeStack.Screen
        name="Report"
        options={{
          ...TransitionPresets.RevealFromBottomAndroid,
        }}
      >
        {({ navigation, route }) => (
          <Layout.LayoutModalStackItem
            name={route.name}
            navigation={navigation}
            route={route}
            bgColor="red.100"
            color="light.100"
          >
            <ReportView navigation={navigation} route={route} />
          </Layout.LayoutModalStackItem>
        )}
      </HomeStack.Screen>
      <HomeStack.Screen name="Report List">
        {({ navigation, route }) => (
          <Layout.LayoutFocusStackItem
            name={route.name}
            navigation={navigation}
            route={route}
            side={
              <SideInfo.ReportList color="light.100" id={route.params.id} />
            }
            bgColor="red.100"
            color="light.100"
          >
            <ReportListView navigation={navigation} route={route} />
          </Layout.LayoutFocusStackItem>
        )}
      </HomeStack.Screen>
      <HomeStack.Screen
        name="Task Maker"
        options={{
          headerShown: false,
        }}
      >
        {({ navigation, route }) => (
          <Layout.LayoutFocusStackItem
            name={route.name}
            navigation={navigation}
            route={route}
            bgColor="red.100"
            color="light.100"
          >
            <TaskMaker navigation={navigation} route={route} />
          </Layout.LayoutFocusStackItem>
        )}
      </HomeStack.Screen>
    </HomeStack.Navigator>
  </Box>
);

export default Home;
