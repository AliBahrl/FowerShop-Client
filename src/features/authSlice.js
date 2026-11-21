import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import axiosInstance from "../api/axiosInstance"


const userFromStorage = localStorage.getItem('user')
    ? JSON.parse(localStorage.getItem('user'))
    : null;
const tokenFromStorage = localStorage.getItem('token') || null;


const initialState = {
    user: userFromStorage,
    token: tokenFromStorage,
    status: 'idle',
    error: null,
}

export const registerUser = createAsyncThunk('auth/registerUser', async (credentials, { rejectWithValue }) => {
    try {
        const registerRes = await axiosInstance.post('/auth/local/register', {
            username: credentials.username,
            email: credentials.email,
            password: credentials.password,
        });
        const token = registerRes.data.jwt;
        const user = registerRes.data.user;

        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));

        return { token, user };
    } catch (err) {
        return rejectWithValue(err.response?.data?.error?.message || 'Register failed');
    }
});

export const loginUser = createAsyncThunk('auth/login', async (credentials, { rejectWithValue }) => {
    try {
        const loginRes = await axiosInstance.post('/auth/local', {
            identifier: credentials.identifier,
            password: credentials.password,
        })
        const token = loginRes.data.jwt
        const user = loginRes.data.user

        localStorage.setItem('token', token)
        localStorage.setItem('user', JSON.stringify(user))
        return { token, user }
    } catch (err) {
        return rejectWithValue(err.response?.data?.error?.message || 'login failed')
    }
})

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state) => {
            state.user = null
            state.token = null
            localStorage.removeItem('user')
            localStorage.removeItem('token')
        },
    },
    extraReducers: (builder) => {
        builder.addCase(registerUser.pending, (state) => {
            state.status = 'loading'
        })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.status = 'succeeded'
                state.user = action.payload.user
                state.token = action.payload.token
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.status = 'failed'
                state.error = action.payload
            })

            .addCase(loginUser.pending, (state) => {
                state.status = 'loading'
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.status = 'succeeded'
                state.user = action.payload.user
                state.token = action.payload.token

            })
            .addCase(loginUser.rejected, (state, action) => {
                state.status = 'failed'
                state.error = action.payload
            })
    }
})

export const { logout } = authSlice.actions
export const authReducer = authSlice.reducer