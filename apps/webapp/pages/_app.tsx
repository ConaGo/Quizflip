import { useEffect } from 'react';
import type { AppProps } from 'next/app';
import React from 'react';
import { CssBaseline, ThemeProvider } from '@material-ui/core';
import { darkTheme, lightTheme } from '../src/styles/muiTheme';
import NavBar from '../src/components/NavBar';
import Head from 'next/head';
import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import { withProviders } from '@libs/components';

//Adding _retry to type
interface AxiosErrorWithRetry extends AxiosError {
  config: AxiosRequestConfigWithRetry;
}
interface AxiosRequestConfigWithRetry extends AxiosRequestConfig {
  _retry: boolean;
}

//configure axios
axios.defaults.baseURL = process.env.NEXT_PUBLIC_API_URL;
axios.defaults.withCredentials = true; //sending cookies with each request
//Setup interceptor to get new JWTs when they reach their MaxAge
axios.interceptors.response.use(
  //If there is no error simply return the response
  (response) => response,
  async (err: AxiosErrorWithRetry) => {
    console.log(err);
    const originalRequest = err.config;
    if (err.response.status === 401) {
      console.log(originalRequest);
      if (originalRequest.url === '/auth/refresh') console.log('please Login');
      else if (!originalRequest._retry) {
        originalRequest._retry = true;
        await axios.get('/auth/refresh');
        return axios(originalRequest);
      }
    }
    return Promise.reject(err);
  }
);
function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
  }, []);
  return (
    <ThemeProvider theme={lightTheme}>
      {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
      <CssBaseline />
      <Head>
        <title>Learnit Digital</title>
        <meta name="description" content="Online Learning for University" />
        <link rel="icon" href="/favicon.ico" />
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
      </Head>
      {/* This allows react Router to kick in on all pages that are not defined in the pages folder */}
      <div suppressHydrationWarning>
        {typeof window === 'undefined' ? null : (
          <>
            <NavBar></NavBar>
            <Component {...pageProps} />
          </>
        )}
      </div>
    </ThemeProvider>
  );
}
export default withProviders(MyApp);
