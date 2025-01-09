import axios from 'axios';
import store from './redux/store'
import { clearAuthData } from './redux/auth/authSlice';
const adminAxiosInstance = axios.create({
  baseURL: 'http://localhost:8000/api/',
});

adminAxiosInstance.interceptors.request.use(
  (config) => {
    const adminAccessToken = localStorage.getItem('adminAccessToken');
    if (adminAccessToken) {
      config.headers['Authorization'] = `Bearer ${adminAccessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

adminAxiosInstance.interceptors.response.use(
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

                localStorage.setItem('adminAccessToken', access);
                localStorage.setItem('adminRefreshToken', refresh);
                axios.defaults.headers.common['Authorization'] = `Bearer ${access}`;

                originalRequest.headers['Authorization'] = `Bearer ${access}`;
                return adminAxiosInstance(originalRequest)
            } catch (refreshError) {
                store.dispatch(clearAuthData());
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
)

export default adminAxiosInstance;