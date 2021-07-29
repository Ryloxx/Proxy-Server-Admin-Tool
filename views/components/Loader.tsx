import { Center, Spinner } from 'native-base';
import React, { FC } from 'react';
import Error from './Error';

interface LoaderProps {
  loading: boolean;
  error?: string;
}
const Loader: FC<LoaderProps> = ({ loading, error, children }) => {
  if (error) return <Error.ErrorText>{error}</Error.ErrorText>;
  if (loading)
    return (
      <Center flex={1}>
        <Spinner size="sm" />
      </Center>
    );
  if (children) return <>{children}</>;
  return null;
};

export default Loader;
