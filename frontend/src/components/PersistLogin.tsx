import React, { useEffect, useState } from 'react';
import { useRefreshToken } from '../services/useRefreshToken';
import useAuth from '../hooks/useAuth';
import { ContextType } from '../context/Provider/AuthProvider';
import { Outlet } from 'react-router-dom';

export const PersistLogin: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const refresh = useRefreshToken();
  const { auth } = useAuth() as ContextType;

  useEffect(() => {
    const verifyRefreshToken = async () => {
      try {
        await refresh();
      } catch (err) {
        console.log(err);
      } finally {
        setIsLoading(false);
      }
    };
    !auth?.accessToken ? verifyRefreshToken() : setIsLoading(false);
  }, [auth.accessToken, refresh]);

  // useEffect(() => {
  //   console.log(`isLoading: ${isLoading}`),
  //     console.log(`Access token: ${auth.accessToken}`);
  // }, [isLoading]);

  return <>{isLoading ? <p>Loading...</p> : <Outlet />}</>;
};
