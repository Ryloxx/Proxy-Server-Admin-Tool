import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import API from '../../classes/api';
import { selectors } from '../../store/stateReducer';

// @ts-ignore
export const ApiContext = React.createContext<API>();
const ApiProvider: React.FC = ({ children }) => {
  const settings = useSelector(selectors.selectSettings);
  const api = useMemo(() => {
    if (!settings) return null;
    return new API(settings);
  }, [settings]);
  if (!api) return null;
  return <ApiContext.Provider value={api}>{children}</ApiContext.Provider>;
};

export default ApiProvider;
