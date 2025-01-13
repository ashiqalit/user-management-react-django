import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Outlet, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { updateToken, setAuthData, clearAuthData } from '../redux/auth/authSlice'; 
import axiosInstance from '../axiosconfig';

const AuthWrapper = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    dispatch(clearAuthData());
    navigate('/login');
  };

  useEffect(() => {
    const updateRefreshToken = async () => {
      const storedAccessToken = localStorage.getItem("accessToken");
      if (storedAccessToken) {
        try {
          const newAccessToken = await dispatch(updateToken()).unwrap();
          axios.defaults.headers.common["Authorization"] = `Bearer ${newAccessToken}`;
          axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${newAccessToken}`;
        } catch (error) {
          console.error("Token refresh failed", error);
          handleLogout();
        }
      }
    };

    updateRefreshToken(); // Refresh token immediately on mount

    const intervalId = setInterval(updateRefreshToken, 4000);

    return () => clearInterval(intervalId);
  }, [dispatch]);

  useEffect(() => {
    if (!user) {
      const storedUserData = localStorage.getItem("user");
      if (storedUserData) {
        const parsedUserData = JSON.parse(storedUserData);
        dispatch(setAuthData({ user: parsedUserData }));
      } else {
        handleLogout();
      }
    }
  }, [dispatch, user]);

  return <Outlet />;
};

export default AuthWrapper;

