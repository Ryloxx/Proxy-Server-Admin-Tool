import { useCallback, useEffect, useRef, useState } from 'react';

interface RequestResult {
  loading: boolean;
  error: string;
  send: (...args: any[]) => void;
}

export const useMounted = () => {
  const mounted = useRef(true);
  const isMounted = useCallback(() => mounted.current, []);
  useEffect(
    () => () => {
      mounted.current = false;
    },
    []
  );
  return isMounted;
};

export const useRequest: <T>(
  request: (...args: any[]) => Promise<T>,
  callback?: ((result: T) => unknown) | null
) => RequestResult = (request, callback = null) => {
  const isMounted = useMounted();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const send = useCallback(
    (...args: any[]) => {
      setError('');
      setLoading(true);
      (request
        ? request(...args)
        : Promise.reject(new Error('Invalid request'))
      )
        .then((result) => callback && isMounted() && callback(result))
        .catch((err) => isMounted() && setError(err.message))
        .finally(() => isMounted() && setLoading(false));
    },
    [callback, isMounted, request]
  );

  return {
    loading,
    error,
    send,
  };
};
