import axios from 'axios';
import { refreshAccessToken } from './auth';

const axiosClient = axios.create({
  baseURL: '',
  withCredentials: true, 
});

export const apiRequest = async (url, options = {}, retry = true) => {
  try {
    const method = options.method ? options.method.toLowerCase() : 'get';
    const config = {
      url,
      method,
      ...options,
    };
    if (options.body) {
      config.data = options.body;
      delete config.body;
    }
    const res = await axiosClient.request(config);
    return res;
  } catch (error) {
    if (error.response?.status === 401 && retry) {
      try {
        await refreshAccessToken(); 
        return apiRequest(url, options, false);
      } catch (refreshError) {
        throw refreshError;
      }
    }
    console.error('API Request Error:', error);
    throw error;
  }
};
