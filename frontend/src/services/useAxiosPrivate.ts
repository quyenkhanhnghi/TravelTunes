import { axiosPrivate } from './fetch';
import { useEffect } from 'react';
import { useRefreshToken } from './useRefreshToken';
import { ContextType } from '../context/Provider/AuthProvider';
import useAuth from '../hooks/useAuth';
import { useNavigate, useLocation } from 'react-router-dom';

export const useAxiosPrivate = () => {
  const refresh = useRefreshToken();
  const navigate = useNavigate();
  const location = useLocation();
  // const { state } = useContext(AuthContext) as ContextType;
  const { auth } = useAuth() as ContextType;

  useEffect(() => {
    const requestIntercept = axiosPrivate.interceptors.request.use(
      (config) => {
        if (!config.headers.authorization) {
          config.headers.authorization = `Bearer ${auth?.accessToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    const responseIntercept = axiosPrivate.interceptors.response.use(
      (response) => response,
      async (error) => {
        console.log(error);
        const prevRequest = error?.config;
        if (error?.response?.status === 500 && !prevRequest?.sent) {
          prevRequest.sent = true;
          try {
            const newAccessToken = await refresh();
            console.log(newAccessToken);
            prevRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
            return axiosPrivate(prevRequest);
          } catch (err) {
            console.log(err);
          }
          //TODO: when error.status === 404 -> navigate to error page - Not login page
        }
        if (error?.response?.status === 404 && !prevRequest?.sent) {
          prevRequest.sent = true;
          navigate('/error', { state: { from: location }, replace: true });
        }
        return Promise.reject(error);
      }
    );
    return () => {
      axiosPrivate.interceptors.request.eject(requestIntercept);
      axiosPrivate.interceptors.response.eject(responseIntercept);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth, refresh]);

  return axiosPrivate;
};
