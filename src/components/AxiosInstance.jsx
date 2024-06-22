import axios from 'axios';

const backendUrl = 'http://localhost:8080';

const AxiosInstance = axios.create({
  baseURL: backendUrl,
});


AxiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default AxiosInstance;
