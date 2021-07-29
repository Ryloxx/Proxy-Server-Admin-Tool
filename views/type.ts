import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { ParamListBase, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

export interface TabsNavigationRouteProps<
  T extends ParamListBase,
  S extends keyof T
> {
  navigation: BottomTabNavigationProp<T, S>;
  route: RouteProp<T, S>;
}

export interface StackNavigationRouteProps<
  T extends ParamListBase,
  S extends keyof T
> {
  navigation: StackNavigationProp<T, S>;
  route: RouteProp<T, S>;
}
