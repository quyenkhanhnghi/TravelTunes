import { createContext, useReducer, useState } from 'react';
import { InitalState, StateType } from '../InitialState/InitalState';
import { ReducerAction, userReducer } from '../Reducer/Reducer';
import React from 'react';

export type ContextType = {
  auth: StateType;
  dispatchAuth: React.Dispatch<ReducerAction>;
  persist: boolean;
  setPersist: React.Dispatch<React.SetStateAction<boolean>>; // Add persist state setter
};

interface AuthProviderProps {
  children: React.ReactNode;
}
export const AuthContext = createContext<ContextType | null>(null);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [auth, dispatchAuth] = useReducer(userReducer, InitalState);
  const [persist, setPersist] = useState(() => {
    const persistedValue = localStorage.getItem('persist');
    return persistedValue !== null ? JSON.parse(persistedValue) : false;
  });

  return (
    <AuthContext.Provider value={{ auth, dispatchAuth, persist, setPersist }}>
      {children}
    </AuthContext.Provider>
  );
};
