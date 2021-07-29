import React, { FC } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { StackNavigationRouteProps } from '../../../type';
import { SettingsStackParamList } from '../type';
import Login from './Login';
import Signup from './Signup';
import { AuthStackParamList } from './type';
import Layout from '../../../components/Layout';

const AuthStack = createStackNavigator<AuthStackParamList>();
const Auth: FC<StackNavigationRouteProps<SettingsStackParamList, 'Auth'>> = ({
  navigation,
}) => (
  <AuthStack.Navigator headerMode="none">
    <AuthStack.Screen name="Login">
      {({ navigation: nav, route }) => (
        <Layout.LayoutModalStackItem
          name="Login"
          navigation={nav}
          route={route}
        >
          <Login
            navigation={nav}
            route={route}
            onLogin={() => {
              navigation.navigate('Settings');
            }}
          />
        </Layout.LayoutModalStackItem>
      )}
    </AuthStack.Screen>
    <AuthStack.Screen name="Signup">
      {({ navigation: nav, route }) => (
        <Layout.LayoutModalStackItem
          name="Signup"
          navigation={nav}
          route={route}
        >
          <Signup
            navigation={nav}
            route={route}
            onSignup={() => {
              navigation.navigate('Auth', {
                screen: 'Login',
              });
            }}
          />
        </Layout.LayoutModalStackItem>
      )}
    </AuthStack.Screen>
  </AuthStack.Navigator>
);

export default Auth;
