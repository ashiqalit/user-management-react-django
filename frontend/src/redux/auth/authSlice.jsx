import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

const initialState = {
    user: null,
    accessToken: null,
    refreshToken: null,
    isAuthenticated: false,
}

export const refreshToken = createAsyncThunk(
    'auth/refreshToken',
    async(_, {getState, dispatch}) => {
        const state = getState();
        const response = await axios.post('/api/token/refresh/', {
            refresh: state.auth.refreshToken,
        });
        dispatch(setAccessToken(response.data.access));
        return response.data.access;
    }
)

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers:{
        setAuthData(state, action){
            state.user = action.payload.user;
            state.accessToken = action.payload.token;
            state.refreshToken = action.payload.token;
            state.isAuthenticated = true;
        },
        setAccessToken(state, action){
            state.accessToken = action.payload
        },
        clearAuthData(state){
            state.user = null;
            state.accessToken = null;
            state.refreshToken = null;
            state.isAuthenticated = false;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(refreshToken.fulfilled, (state, action) => {
            state.accessToken = action.payload;
        });
    },
});

export const { setAuthData, clearAuthData, setAccessToken } = authSlice.actions;
export default authSlice.reducer;