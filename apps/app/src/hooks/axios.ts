import baseAxios, { AxiosError, AxiosRequestConfig } from 'axios';
interface AxiosErrorWithRetry extends AxiosError {
  config: AxiosRequestConfigWithRetry;
}
interface AxiosRequestConfigWithRetry extends AxiosRequestConfig {
  _retry: boolean;
}
const refreshRequest = async () => axios.get('auth/refresh');
const axios = baseAxios.create({
  baseURL: 'http://localhost:3070',
  withCredentials: true,
});
axios.interceptors.response.use(
  //If there is no error simply return the response
  async (response) => {
    try {
      if (response.data.errors[0].message === 'Unauthorized') {
        await refreshRequest();
      }
    } catch {
      console.log(response);
      return response;
    }
    return response;
  },
  async (err: AxiosErrorWithRetry) => {
    console.log(err);
    const originalRequest = err.config;
    if (err.response?.status === 401) {
      console.log(originalRequest);
      if (originalRequest.url === 'auth/refresh') {
        console.log('tried two times');
      } else if (!originalRequest._retry) {
        originalRequest._retry = true;
        await refreshRequest();
        return axios(originalRequest);
      }
    }
    return Promise.reject(err);
  }
);
export default axios;
