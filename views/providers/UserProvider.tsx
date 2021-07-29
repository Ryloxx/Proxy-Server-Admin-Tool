import React, { FC, useCallback, useContext, useEffect, useState } from 'react';
import { EventRegister } from 'react-native-event-listeners';
import { useRequest } from '../hooks';
import { ApiContext } from './ApiProvider';

export type UserInfo = {
  username: string;
  email: string;
};
export const UserContext = React.createContext<null | UserInfo>(null);
const UserProvider: FC = ({ children }) => {
  const api = useContext(ApiContext);
  const [user, setUser] = useState<UserInfo | null>(null);
  const request = useCallback(async () => api.login(), [api]);
  const { send } = useRequest(request);
  useEffect(() => {
    const id = EventRegister.on('userchange', (changedUser: UserInfo) => {
      setUser(changedUser);
    });
    return () => {
      if (typeof id === 'string') {
        EventRegister.rm(id);
      }
    };
  }, []);
  useEffect(() => {
    send();
  }, [send]);
  return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
};

export default UserProvider;
