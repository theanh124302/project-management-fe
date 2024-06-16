// axiosInstance.js
import axios from 'axios';

const backendUrl = 'http://localhost:8080'; // Cập nhật URL backend cố định ở đây

const AxiosInstance = axios.create({
  baseURL: backendUrl,
});

// Thiết lập interceptor để thêm token vào mỗi request
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
