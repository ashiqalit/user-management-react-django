import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Outlet, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { updateAdminToken, setAuthAdminData, clearAuthAdminData } from '../redux/auth/authSlice'; 
import axiosInstance from '../axiosconfig';
import adminAxiosInstance from '../adminaxiosconfig';

const AuthWrapperAdmin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const adminUser = useSelector((state) => state.auth.adminUser);

  const handleLogout = () => {
    localStorage.removeItem('adminAccessToken');
    localStorage.removeItem('adminRefreshToken');
    localStorage.removeItem('adminUser');
    localStorage.removeItem('adminData');
    dispatch(clearAuthAdminData());
    navigate('/login');
  };

  useEffect(() => {
    const updateRefreshToken = async () => {
      const storedAccessToken = localStorage.getItem("adminAccessToken");
      if (storedAccessToken) {
        try {
          const newAccessToken = await dispatch(updateAdminToken()).unwrap();
          axios.defaults.headers.common["Authorization"] = `Bearer ${newAccessToken}`;
          adminAxiosInstance.defaults.headers.common["Authorization"] = `Bearer ${newAccessToken}`;
        } catch (error) {
          console.error("Token refresh failed", error);
          handleLogout();
        }
      }
    };

    // updateRefreshToken(); // Refresh token immediately on mount

    const intervalId = setInterval(updateRefreshToken, 4000);

    return () => clearInterval(intervalId);
  }, [dispatch]);

  useEffect(() => {
    if (!adminUser) {
      const storedUserData = localStorage.getItem("adminUser");
      if (storedUserData) {
        const parsedUserData = JSON.parse(storedUserData);
        dispatch(setAuthAdminData({ user: parsedUserData }));
      } else {
        handleLogout();
      }
    }
  }, [dispatch, adminUser]);

  return <Outlet />;
};

export default AuthWrapperAdmin;

