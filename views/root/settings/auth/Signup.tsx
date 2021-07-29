/* eslint-disable no-useless-escape */
import { Box } from 'native-base';
import React, { FC, useContext } from 'react';
import ErrorCPT from '../../../components/Error';
import Form from '../../../components/Form';
import { useRequest } from '../../../hooks';
import { ApiContext } from '../../../providers/ApiProvider';
import { StackNavigationRouteProps } from '../../../type';
import { AuthStackParamList } from './type';

const Signup: FC<
  StackNavigationRouteProps<AuthStackParamList, 'Signup'> & {
    onSignup: () => void;
  }
> = ({ onSignup }) => {
  const api = useContext(ApiContext);
  const {
    error: signupError,
    loading: signupLoading,
    send: signup,
  } = useRequest(async (args) => {
    if (args.confirm !== args.password) {
      throw new Error('Password and Confirm missmatch');
    }
    return api.signup(args);
  }, onSignup);
  return (
    <Box>
      <ErrorCPT.ErrorText textAlign="center">{signupError}</ErrorCPT.ErrorText>
      <Form
        loading={signupLoading}
        onDataSubmit={signup}
        fields={[
          {
            label: 'Username',
            name: 'username',
            type: 'text',
            validator: {
              pattern: {
                regex: /^.{3,20}$/i,
                errorMessage:
                  'Username length must be between 3 and 20 characters',
              },
              required: true,
            },
          },
          {
            label: 'Email',
            name: 'email',
            type: 'email',
            validator: {
              pattern: {
                regex: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/i,
                errorMessage: 'Invalid email',
              },
              required: true,
            },
          },
          {
            label: 'Password',
            name: 'password',
            type: 'password',
            validator: {
              pattern: {
                regex: /^[^\s]{8,20}$/i,
                errorMessage:
                  'Password must be between 8 and 20 character without spaces.',
              },
              required: true,
            },
          },
          {
            label: 'Confirm Password',
            name: 'confirm',
            type: 'password',
            validator: {
              required: true,
            },
          },
          {
            label: 'Admin passphrase',
            name: 'creds',
            type: 'password',
            validator: {
              required: true,
            },
          },
        ]}
      />
    </Box>
  );
};
export default Signup;
