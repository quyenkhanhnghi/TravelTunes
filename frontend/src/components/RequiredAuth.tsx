import React from 'react';
import { useLocation, Navigate, Outlet } from 'react-router-dom';
import { ContextType } from '../context/Provider/AuthProvider';
import useAuth from '../hooks/useAuth';
import { ErrorPage } from './ErrorPage';

interface RequiredAuthProps {
  allowedRoles: string[];
}

export const RequiredAuth: React.FC<RequiredAuthProps> = ({ allowedRoles }) => {
  // const { state, dispatch } = React.useContext(AuthContext) as ContextType;
  const { auth } = useAuth() as ContextType;
  const location = useLocation();
  const roleUser = auth?.user?.role || '';
  const checkAuth = allowedRoles.includes(roleUser);

  return checkAuth ? (
    <Outlet />
  ) : (
    <>
      <ErrorPage />
      <Navigate to='/login' state={{ from: location }} replace />
    </>
  );
};
