import { Box, Button, Center, Text } from 'native-base';
import React, { FC, useContext } from 'react';
import { makeBulletListText } from '../../utils';
import Error from '../components/Error';
import LabeledData from '../components/LabeledData';
import Layout from '../components/Layout';
import { useRequest } from '../hooks';
import { ApiContext } from '../providers/ApiProvider';
import { UserContext, UserInfo } from '../providers/UserProvider';
import { TabsNavigationRouteProps } from '../type';
import { TabsParamList } from './type';

const UserInfoView: FC<UserInfo> = ({ email, username }) => (
  <LabeledData
    center
    data={[
      ['Username', username],
      ['Email', email],
    ]}
  />
);
const User: FC<TabsNavigationRouteProps<TabsParamList, 'User'>> = ({
  navigation,
  route,
}) => {
  const user = useContext(UserContext);
  const api = useContext(ApiContext);
  const { error, loading, send: retry } = useRequest(() => api.login());
  return (
    <Layout.LayoutTabDefault
      name="Profile"
      navigation={navigation}
      route={route}
      bgColor={user ? 'yellow.20' : 'blue.100'}
      color={user ? undefined : 'light.100'}
      mat={!user}
    >
      {user ? (
        <UserInfoView email={user.email} username={user.username} />
      ) : (
        <Box bg="blue.100" flex={1}>
          <Center>
            <Text color="light.100" fontWeight="semibold">
              If you see this message it means there is a problem connecting the
              server, check one of those options
              <Box>
                {makeBulletListText(
                  [
                    'The api url you provided in settings',
                    'Your login info in settings',
                    'Your version is up to date',
                  ],
                  'bullet'
                ).map((item) => (
                  <Text key={item} color="light.100" fontWeight="bold">
                    {item}
                  </Text>
                ))}
              </Box>
            </Text>
            <Error.ErrorText>{error}</Error.ErrorText>
            <Button
              isLoading={loading}
              isLoadingText="Logging in"
              _text={{
                color: error ? 'light.100' : 'blue.100',
              }}
              bgColor={error ? 'red.100' : 'light.100'}
              onPress={retry}
            >
              Retry
            </Button>
          </Center>
        </Box>
      )}
    </Layout.LayoutTabDefault>
  );
};
export default User;
