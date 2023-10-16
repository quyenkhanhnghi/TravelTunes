import { ContextType } from '../context/Provider/AuthProvider';
import axios from 'axios';
import useAuth from '../hooks/useAuth';

export const useRefreshToken = () => {
  // const { dispatch } = React.useContext(AuthContext) as ContextType;
  const { dispatchAuth } = useAuth() as ContextType;

  const refresh = async () => {
    const response = await axios.get(
      'http://localhost:3001/api/v1/users/refreshToken',
      {
        withCredentials: true,
      }
    );

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
