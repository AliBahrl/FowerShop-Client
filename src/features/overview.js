import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import axiosInstance from "../api/axiosInstance"

const initialState = {
    data: null,
    status: 'idle',
    error: null
}

export const fetchOverview = createAsyncThunk('overview/fetch', async (_, { getState, rejectWithValue }) => {
    try {
        const token = getState().auth.token
        const res = await axiosInstance.get('/dashboard/overview', {
            headers: { Authorization: `Bearer ${token}` }
        })
        return res.data
    } catch (err) {
        return rejectWithValue(err.response?.data?.error?.message || 'Failed to fetch overview')
    }
})

const overviewSlice = createSlice({
    name: 'overview',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchOverview.pending, (state) => {
                state.status = 'loading'
            })
            .addCase(fetchOverview.fulfilled, (state, action) => {
                state.status = 'succeeded'
                state.data = action.payload
            })
            .addCase(fetchOverview.rejected, (state, action) => {
                state.status = 'failed'
                state.error = action.payload
            })
    }
})

export const overviewReducer = overviewSlice.reducer
