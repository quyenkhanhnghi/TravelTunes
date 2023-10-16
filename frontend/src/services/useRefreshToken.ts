import { ContextType } from '../context/Provider/AuthProvider';
import axios from 'axios';
import useAuth from '../hooks/useAuth';

export const useRefreshToken = () => {
  const baseURL = import.meta.env.VITE_REACT_APP_BACKEND_URL;
  const { dispatchAuth } = useAuth() as ContextType;

  const refresh = async () => {
    const response = await axios.get(`${baseURL}api/v1/users/refreshToken`, {
      withCredentials: true,
    });

    dispatchAuth({
      type: 'updateAcessToken',
      payload: {
        user: response.data.data.user,
        accessToken: response.data.data.accessToken,
      },
    });
    return response.data.data.accessToken;
  };
  return refresh;
};
