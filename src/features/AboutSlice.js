import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import axiosInstance from "../api/axiosInstance"

const initialState = {
    aboutData: null,
    status: 'idle',
    error: null,
}

// about Fetch 
export const aboutFetch = createAsyncThunk('about/aboutFetch', async (_, { rejectWithValue }) => {
    try {
        const res = await axiosInstance.get('/about?populate=*')
        return res.data.data
    } catch (err) {
        return rejectWithValue(err.response?.data?.error?.message || 'Failed to fetch about')
    }
})

// edit fetch 
export const updateAbout = createAsyncThunk('about/updateAbout', async (payload, { getState, rejectWithValue }) => {
    try {
        const token = getState().auth.token
        const { title, description, stat } = payload
        const data = { title, description }
        for (let i = 0; i < stat.length; i++) {
            const num = i + 1
            data[`stat${num}number`] = stat[i].number
            data[`stat${num}label`] = stat[i].label
            if (stat[i].iconFile) {
                const formData = new FormData()
                formData.append('files', stat[i].iconFile)
                const uploadRes = await axiosInstance.post('/upload', formData, {
                    headers: { Authorization: `Bearer ${token}` }
                })
                data[`stat${num}Icon`] = uploadRes.data[0].id
            }
        }
        const res = await axiosInstance.put('/about?populate=*', { data }, {
            headers: { Authorization: `Bearer ${token}` }
        })
        return res.data.data
    } catch (err) {
        return rejectWithValue(err.response?.data?.error?.message || 'Failed to update about')
    }
})


const aboutSlice = createSlice({
    name: 'about',
    initialState,
    extraReducers: (builder) => {
        builder.addCase(aboutFetch.pending, (state) => {
            state.status = 'loading'
        })
            .addCase(aboutFetch.fulfilled, (state, action) => {
                state.status = 'succeeded'
                state.aboutData = action.payload
            })
            .addCase(aboutFetch.rejected, (state, action) => {
                state.status = 'failed'
                state.error = action.payload
            })
            .addCase(updateAbout.fulfilled, (state, action) => {
                state.aboutData = action.payload
            })
    }
})

export const aboutReducer = aboutSlice.reducer