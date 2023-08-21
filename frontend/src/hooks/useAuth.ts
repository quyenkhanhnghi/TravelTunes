import { useContext, useDebugValue } from 'react';
import { AuthContext, ContextType } from '../context/Provider/AuthProvider';

const useAuth = () => {
  const { auth } = useContext(AuthContext) as ContextType;
  useDebugValue(auth, (auth) => (auth?.user ? 'Logged In' : 'Logged Out'));
  return useContext(AuthContext);
};

export default useAuth;
