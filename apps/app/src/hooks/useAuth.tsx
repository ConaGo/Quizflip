import React, {
  ReactChildren,
  useState,
  useEffect,
  createContext,
  useContext,
} from 'react';
import axios, { AxiosError, AxiosRequestConfig } from 'axios';

import { useMutation, useQuery } from 'react-query';
import { DTO, LoginDto, SignupDto, RecoveryDto } from '@libs/shared-types';

//Adding _retry to type
interface AxiosErrorWithRetry extends AxiosError {
  config: AxiosRequestConfigWithRetry;
}
interface AxiosRequestConfigWithRetry extends AxiosRequestConfig {
  _retry: boolean;
}
type UserMethods = {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
};
type User = {
  id: number;
  email: string;
  name: string;
  user: string;
};
const loginRequest = async (payload: LoginDto) =>
  axios.post('auth/login', payload);

const signupRequest = async (payload: SignupDto) => {
  axios.post('auth/register', payload);
};

const logoutRequest = async () => axios.post('auth/logout');
const refreshRequest = async () => axios.get('auth/refresh');

const AuthContext: React.Context<UserMethods> = createContext<UserMethods>({
  user: null,
  login: () => {
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
  const loginQuery = useMutation('user', loginRequest, {
    onSuccess: (data) => {
      setUser(data.data);
      console.log(data);
    },
  });
  /*  const refreshQuery = useQuery('user', refreshRequest, {
    onError: (data) => {
      console.log('error');
    },
    onSuccess: (data) => {
      console.log('refetching');
      console.log(data);
    },
    refetchInterval: 300000,
  }); */
  const [user, setUser] = useState<User | null>(null);

  const login = async (user: User) => {
    setUser(user);
  };
  const logout = async () => {
    window.localStorage.clear();
    await logoutRequest();
    setUser(null);
  };

  useEffect(() => {
    //configure axios
    axios.defaults.baseURL = 'http://localhost:3070';
    axios.defaults.withCredentials = true; //sending cookies with each request
    axios.interceptors.response.use(
      //If there is no error simply return the response
      (response) => response,
      async (err: AxiosErrorWithRetry) => {
        console.log(err);
        const originalRequest = err.config;
        if (err.response?.status === 401) {
          console.log(originalRequest);
          if (originalRequest.url === 'auth/refresh')
            console.log('please Login');
          else if (!originalRequest._retry) {
            originalRequest._retry = true;
            await refreshRequest();
            return axios(originalRequest);
          }
        }
        return Promise.reject(err);
      }
    );

    // configure axios-hooks to use this instance of axios
    //configure({ axios });
  }, []);
  return {
    user,
    login,
    logout,
  };
}
/* function AuthProvidesr(props: any) {
  const loginQuery = useMutation('user', loginRequest, {
    onSuccess: (data) => {
      console.log(data);
    },
  });

  // this request should not have to include any logic as we are sending the token value with the cookies.
  const refreshQuery = useQuery('user', refreshRequest, {
    onSuccess: (data) => {
      console.log(user);
    },
    refetchInterval: 300000,
  });

  const login = async (dto: LoginDto) => {
    await loginQuery.mutate(dto);
    // you might want to wrap this in try / catch to handle errors and alert the user
    // if the username/password is incorrect.
  };

  useEffect(() => {
    // add authorization token to each request
    axios.interceptors.request.use(
      //If there is no error simply return the response
      (response) => response,
      async (err: AxiosErrorWithRetry) => {
        console.log(err);
        const originalRequest = err.config;
        if (err.response?.status === 401) {
          console.log(originalRequest);
          if (originalRequest.url === '/auth/refresh')
            console.log('please Login');
          else if (!originalRequest._retry) {
            originalRequest._retry = true;
            await axios.get('/auth/refresh');
            return axios(originalRequest);
          }
        }
        return Promise.reject(err);
      }
    );

    // configure axios-hooks to use this instance of axios
    configure({ axios });
  }, []);
  // if you need a user object you can do something like this.
  const user = refreshQuery.data?.user || loginQuery.data?.user;
  const useAuth = () => {
    const context = React.useContext(AuthContext);
    if (context === undefined) {
      throw new Error('AuthContext must be within AuthProvider');
    }

    return context;
  };
  // example on provider
  return <AuthContext.Provider value={...props}></AuthContext.Provider>;
}
 */
