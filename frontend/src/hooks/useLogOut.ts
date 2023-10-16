import { ContextType } from '../context/Provider/AuthProvider';
import { signOut } from '../services/fetch';
import useAuth from './useAuth';
// import { useAxiosPrivate } from '../services/useAxiosPrivate';

const useLogout = () => {
  const { dispatchAuth } = useAuth() as ContextType;
  // const axiosPrivate = useAxiosPrivate();
  const logout = async () => {
    try {
      await signOut();
      dispatchAuth({ type: 'logout' });
    } catch (err) {
      console.error(err);
    }
  };

  return logout;
};

export default useLogout;
