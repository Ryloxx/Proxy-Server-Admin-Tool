import { NavigatorScreenParams } from '@react-navigation/native';
import { AuthStackParamList } from './auth/type';

export type SettingsStackParamList = {
  Settings: undefined;
  Auth: NavigatorScreenParams<AuthStackParamList>;
};
