import axios from 'axios';
import store from './redux/store'
import { clearAuthData } from './redux/auth/authSlice';
const axiosInstance = axios.create({
  baseURL: 'http://localhost:8000/api/',
});

axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      config.headers['Authorization'] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refreshToken = localStorage.getItem('refreshToken');
                const response = await axios.post('http://localhost:8000/api/token/refresh/', {
                    refresh: refreshToken,
                });
                const {access, refresh} = response.data;
                store.dispatch(refreshToken(response.data))

                localStorage.setItem('accessToken', access);
                localStorage.setItem('refreshToken', refresh);
                axios.defaults.headers.common['Authorization'] = `Bearer ${access}`;

                originalRequest.headers['Authorization'] = `Bearer ${access}`;
                return axiosInstance(originalRequest)
            } catch (refreshError) {
                store.dispatch(clearAuthData());
                // console.error(refreshError);
                
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
)

export default axiosInstance;