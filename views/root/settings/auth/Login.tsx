import { Box, Flex, Text } from 'native-base';
import React, { FC, useEffect } from 'react';
import { EventRegister } from 'react-native-event-listeners';
import { useDispatch } from 'react-redux';
import { actions } from '../../../../store/stateReducer';
import Error from '../../../components/Error';
import Form from '../../../components/Form';
import { useRequest } from '../../../hooks';
import { StackNavigationRouteProps } from '../../../type';
import { AuthStackParamList } from './type';

const Login: FC<
  StackNavigationRouteProps<AuthStackParamList, 'Login'> & {
    onLogin: () => void;
  }
> = ({ navigation, onLogin }) => {
  const dispatch = useDispatch();
  const {
    error: loginError,
    loading: loginLoading,
    send: login,
  } = useRequest(async (args) => {
    dispatch(
      actions.updateSettings({
        ...args,
      })
    );
  }, onLogin);
  useEffect(() => {
    dispatch(
      actions.updateSettings({
        password: '',
        username: '',
      })
    );
    EventRegister.emit('userchange', null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <Box>
      <Error.ErrorText textAlign="center">{loginError}</Error.ErrorText>
      <Form
        loading={loginLoading}
        buttonLabel="Save"
        onDataSubmit={login}
        fields={[
          {
            label: 'Username',
            name: 'username',
            type: 'text',
            validator: {
              required: true,
            },
          },
          {
            label: 'Password',
            name: 'password',
            type: 'password',
            validator: {
              required: true,
            },
          },
        ]}
      />
      <Flex alignItems="flex-start">
        <Text
          fontWeight="semibold"
          pb={5}
          pr={5}
          pt={2}
          pl={2}
          onPress={() => {
            navigation.navigate('Signup');
          }}
        >
          Signup
        </Text>
      </Flex>
    </Box>
  );
};
export default Login;
