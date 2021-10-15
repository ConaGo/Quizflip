import { Joi } from '@libs/shared-types';
import React, { useState, useEffect, useContext, createContext } from 'react';
import { useFormHTTP } from './useFormHTTP';
type User = {
  id: number;
  email: string;
  name: string;
  user: string;
};
type UserMethods = {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
};
const AuthContext: React.Context<UserMethods> = createContext<UserMethods>({
  user: null,
  login: (user) => {
    return;
  },
  logout: () => {
    return;
  },
});

interface IProvideAuth {
  children: React.ReactNode;
}
export const AuthProvider = ({ children }: IProvideAuth) => {
  const auth = useProvideAuth();
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};
// Hook for child components to get the auth object ...
// ... and re-render when it changes.
export const useAuth = () => {
  return useContext(AuthContext);
};
// Provider hook that creates auth object and handles state
function useProvideAuth() {
  const [user, setUser] = useState<User | null>(null);
  //useFormHttp for logout
  const { onSubmit } = useFormHTTP(
    { nameOrEmail: '', password: '' },
    Joi.object({}),
    'logout'
  );

  const login = (user: User) => {
    setUser(user);
  };
  const logout = () => {
    setUser(null);
    onSubmit();
  };

  return {
    user,
    login,
    logout,
  };
}
