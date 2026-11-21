import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import axiosInstance from "../api/axiosInstance"

const initialState = {
    heroData: [],
    status: 'idle',
    error: null,
    actionStatus: 'idle',
}

// hero fetch 
export const heroFetch = createAsyncThunk('hero/fetchHero', async (_, { rejectWithValue }) => {
    try {
        const res = await axiosInstance.get('/heroes?populate=*')
        return res.data.data
    } catch (err) {
        return rejectWithValue(err.response?.data?.error?.message || 'Failed to fetch hero')
    }
})

// hero add 
export const createHero = createAsyncThunk('hero/createHero', async ({ name, description, textColor, btnColor,categoryId, imageFile, bgFile }, { getState, rejectWithValue }) => {
    try {
        const token = getState().auth.token

        const imageFormData = new FormData()
        imageFormData.append('files', imageFile)
        const imageUploadRes = await axiosInstance.post('/upload', imageFormData, {
            headers: { Authorization: `Bearer ${token}` }
        })
        const imageId = imageUploadRes.data[0].id

        const bgFormData = new FormData()
        bgFormData.append('files', bgFile)
        const bgUploadRes = await axiosInstance.post('/upload', bgFormData, {
            headers: { Authorization: `Bearer ${token}` }
        })
        const bgId = bgUploadRes.data[0].id

        const res = await axiosInstance.post('/heroes?populate=*',
            { data: { name, description, textColor, btnColor, category: categoryId, image: imageId, bg: bgId } },
            { headers: { Authorization: `Bearer ${token}` } }
        )
        return res.data.data
    } catch (err) {
        return rejectWithValue(err.response?.data?.error?.message || 'Failed to create hero')
    }
})

// hero edit 
export const updateHero = createAsyncThunk('hero/updateHero', async ({ documentId, name, description, textColor, btnColor, categoryId, imageFile, bgFile }, { getState, rejectWithValue }) => {
    try {
        const token = getState().auth.token
        const payload = { name, description, textColor, btnColor , category: categoryId}

        if (imageFile) {
            const imageFormData = new FormData()
            imageFormData.append('files', imageFile)
            const imageUploadRes = await axiosInstance.post('/upload', imageFormData, {
                headers: { Authorization: `Bearer ${token}` }
            })
            payload.image = imageUploadRes.data[0].id
        }

        if (bgFile) {
            const bgFormData = new FormData()
            bgFormData.append('files', bgFile)
            const bgUploadRes = await axiosInstance.post('/upload', bgFormData, {
                headers: { Authorization: `Bearer ${token}` }
            })
            payload.bg = bgUploadRes.data[0].id
        }

        const res = await axiosInstance.put(`/heroes/${documentId}?populate=*`, { data: payload }, { headers: { Authorization: `Bearer ${token}` } })
        return res.data.data
    } catch (err) {
        return rejectWithValue(err.response?.data?.error?.message || 'Failed to update hero')
    }
})

// hero delete 
export const deleteHero = createAsyncThunk('hero/deleteHero', async (documentId, { getState, rejectWithValue }) => {
    try {
        const token = getState().auth.token
        await axiosInstance.delete(`/heroes/${documentId}`, { headers: { Authorization: `Bearer ${token}` } })
        return documentId
    } catch (err) {
        return rejectWithValue(err.response?.data?.error?.message || 'Failed to delete hero')
    }
})

const heroSlice = createSlice({
    name: 'hero',
    initialState,
    extraReducers: (builder) => {
        builder.addCase(heroFetch.pending, (state) => {
            state.status = 'loading'
        })
            .addCase(heroFetch.fulfilled, (state, action) => {
                state.status = 'succeeded'
                state.heroData = action.payload
            })
            .addCase(heroFetch.rejected, (state, action) => {
                state.status = 'failed'
                state.error = action.payload
            })
            .addCase(createHero.pending, (state) => {
                state.actionStatus = 'loading'
            })
            .addCase(createHero.fulfilled, (state, action) => {
                state.actionStatus = 'succeeded'
                state.heroData.push(action.payload)
            })
            .addCase(createHero.rejected, (state, action) => {
                state.actionStatus = 'failed'
                state.error = action.payload
            })
            .addCase(updateHero.fulfilled, (state, action) => {
                const index = state.heroData.findIndex((h) => h.documentId === action.payload.documentId)
                if (index !== -1) state.heroData[index] = action.payload
            })
            .addCase(deleteHero.fulfilled, (state, action) => {
                state.heroData = state.heroData.filter((h) => h.documentId !== action.payload)
            })
    }
})

export const heroReducer = heroSlice.reducer