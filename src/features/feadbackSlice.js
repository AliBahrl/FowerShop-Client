import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import axiosInstance from "../api/axiosInstance"

const initialState = {
    publishedFeedback: [],
    pendingFeedback: [],
    status: 'idle',
    error: null,
}

// feedback published 
export const fetchPublishedFeedback = createAsyncThunk('feedback/fetchPublished', async (_, { rejectWithValue }) => {
    try {
        const res = await axiosInstance.get('/feedbacks?populate=*')
        return res.data.data
    } catch (err) {
        return rejectWithValue(err.response?.data?.error?.message || 'Failed to fetch feedback')
    }
})

// feedback pending 
export const fetchPendingFeedback = createAsyncThunk('feedback/fetchPending', async (_, { getState, rejectWithValue }) => {
    try {
        const token = getState().auth.token
        const res = await axiosInstance.get('/feedbacks?populate=*&status=draft', {
            headers: { Authorization: `Bearer ${token}` }
        })
        return res.data.data
    } catch (err) {
        return rejectWithValue(err.response?.data?.error?.message || 'Failed to fetch pending feedback')
    }
})

// feedback fetch 
export const createFeedback = createAsyncThunk('feedback/createFeedback', async ({ name, message, rating }, { getState, rejectWithValue }) => {
    try {
        const token = getState().auth.token
        const res = await axiosInstance.post('/feedbacks',
            { data: { name, message, rating } },
            { headers: { Authorization: `Bearer ${token}` } }
        )
        return res.data.data
    } catch (err) {
        return rejectWithValue(err.response?.data?.error?.message || 'Failed to submit feedback')
    }
})

// feedback approve 
export const approveFeedback = createAsyncThunk('feedback/approveFeedback', async (documentId, { getState, rejectWithValue }) => {
    try {
        const token = getState().auth.token
        await axiosInstance.put(`/feedbacks/${documentId}`,
            { data: { publishedAt: new Date().toISOString() } },
            { headers: { Authorization: `Bearer ${token}` } }
        )
        return documentId
    } catch (err) {
        return rejectWithValue(err.response?.data?.error?.message || 'Failed to approve feedback')
    }
})

// feedback reject
export const rejectFeedback = createAsyncThunk('feedback/rejectFeedback', async (documentId, { getState, rejectWithValue }) => {
    try {
        const token = getState().auth.token
        await axiosInstance.delete(`/feedbacks/${documentId}`, {
            headers: { Authorization: `Bearer ${token}` }
        })
        return documentId
    } catch (err) {
        return rejectWithValue(err.response?.data?.error?.message || 'Failed to reject feedback')
    }
})

const feedbackSlice = createSlice({
    name: 'feedback',
    initialState,
    extraReducers: (builder) => {
        builder.addCase(fetchPublishedFeedback.fulfilled, (state, action) => {
            state.status = 'succeeded'
            state.publishedFeedback = action.payload
        })
            .addCase(fetchPendingFeedback.fulfilled, (state, action) => {
                state.pendingFeedback = action.payload
            })
            .addCase(createFeedback.fulfilled, (state, action) => {
                state.pendingFeedback.push(action.payload)
            })
            .addCase(approveFeedback.fulfilled, (state, action) => {
                state.pendingFeedback = state.pendingFeedback.filter((f) => f.documentId !== action.payload)
            })
            .addCase(rejectFeedback.fulfilled, (state, action) => {
                state.pendingFeedback = state.pendingFeedback.filter((f) => f.documentId !== action.payload)
            })
    }
})

export const feedbackReducer = feedbackSlice.reducer