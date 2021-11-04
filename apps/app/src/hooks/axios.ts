import baseAxios from 'axios';

const axios = baseAxios.create({
  baseURL: 'http://localhost:3070',
  withCredentials: true,
});
export default axios;
