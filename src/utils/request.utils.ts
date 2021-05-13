import axios, { AxiosError, AxiosResponse } from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://api.binance.com/api/v3',
});

axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => response.data,
  (error: AxiosError<any>) => Promise.reject(error.response),
);
export default axiosInstance;
