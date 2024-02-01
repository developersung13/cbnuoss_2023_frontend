import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem('access-token');
    if (accessToken) config.headers['x-access-token'] = accessToken;
    return config;
  },
  (error) => {
    // 요청 에러 처리
    return Promise.reject(error);
  },
);

axiosInstance.interceptors.response.use(
  (response) => {
    // 응답 데이터를 처리
    return response;
  },
  (error) => {
    // 응답 에러 처리
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('access-token');
      localStorage.removeItem('refresh-token');
      localStorage.removeItem('activeAuthorization');
      if (typeof window !== 'undefined') window.location.href = '/login';
    }
    return Promise.reject(error);
  },
);

export default axiosInstance;