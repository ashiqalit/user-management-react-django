import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import axiosInstance from "../../axiosconfig";

const initialState = {
  user: null,
  adminUser: null,
  accessToken: null,
  adminAccessToken: null,
  adminRefreshToken: null,
  isAuthenticated: false,
};

export const updateToken = createAsyncThunk(
  "auth/updateToken",
  async (_, { getState, dispatch }) => {
    const state = getState();

    const refreshToken = state.auth.refreshToken;
    if (!refreshToken) {
      throw new Error("No refresh token available");
    }

    console.log("Update token called!");
    try {
      const response = await axiosInstance.post("/token/refresh/", {
        refresh: refreshToken,
      });
      dispatch(setAccessToken(response.data.access));
      dispatch(setRefreshToken(response.data.refresh));
      localStorage.setItem('accessToken', response.data.access)
      localStorage.setItem('refreshToken', response.data.refresh)
    //   return response.data.access;
    } catch (error) {
        console.error('Token refresh request failed:', error); 
        throw error;
    }
  }
);

export const updateAdminToken = createAsyncThunk(
  "auth/updateAdminToken",
  async (_, { getState, dispatch }) => {
    const state = getState();

    const adminRefreshToken = state.auth.adminRefreshToken;
    if (!adminRefreshToken) {
      throw new Error("No refresh token available");
    }

    console.log("Update token called!");
    try {
      const response = await axiosInstance.post("/token/refresh/", {
        refresh: adminRefreshToken,
      });
      dispatch(setAdminAccessToken(response.data.access));
      dispatch(setAdminRefreshToken(response.data.refresh));
      localStorage.setItem('adminAccessToken', response.data.access)
      localStorage.setItem('adminRefreshToken', response.data.refresh)
    //   return response.data.access;
    } catch (error) {
        console.error('Token refresh request failed:', error); 
        throw error;
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {

    setAuthData(state, action) {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.isAuthenticated = true;
    },
    setAccessToken(state, action) {
      state.accessToken = action.payload;
    },
    setRefreshToken(state, action) {
      state.refreshToken = action.payload;
    },
    clearAuthData(state) {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
    },

    setAuthAdminData(state, action) {
      state.adminUser = action.payload.adminUser;
      state.adminAccessToken = action.payload.adminAccessToken;
      state.adminRefreshToken = action.payload.adminRefreshToken;
      state.isAuthenticated = true;
    },
    setAdminAccessToken(state, action) {
      state.adminAccessToken = action.payload;
    },
    setAdminRefreshToken(state, action) {
      state.adminRefreshToken = action.payload;
    },
    clearAuthAdminData(state) {
      state.user = null;
      state.adminAccessToken = null;
      state.adminRefreshToken = null;
      state.isAuthenticated = false;
    },
  },
});

export const { setAuthData, clearAuthData, setAccessToken, setRefreshToken, setAuthAdminData, clearAuthAdminData, setAdminAccessToken, setAdminRefreshToken } =
  authSlice.actions;
export default authSlice.reducer;
