import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import axiosInstance from "../api/axiosInstance"

const initialState = {
    categoryData: [],
    status: 'idle',
    error: null,
    actionStatus: 'idle',
}

const generateSlug = (name) => {
    return name
        .toLowerCase()
        .trim()
        .replace(/[’']/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
}


//  categoryfetch 
export const CategoryFetch = createAsyncThunk('category/fetchCategories', async (_, { rejectWithValue }) => {
    try {
        const res = await axiosInstance.get('/categories?populate=image');
        return res.data.data;
    } catch (err) {
        return rejectWithValue(err.response?.data?.error?.message || 'Failed to fetch categories');
    }
})

// add category 
export const createCategory = createAsyncThunk('category/createCategory', async ({ name, imageFile }, { getState, rejectWithValue }) => {
    const slug = generateSlug(name)
    try {
        const token = getState().auth.token
        const formData = new FormData()
        if (!imageFile) {
            return rejectWithValue('Please select an image')
        }
        formData.append('files', imageFile)
        const uploadRes = await axiosInstance.post('/upload', formData, {
            headers: {
                Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data'
            }
        })
        const imageId = uploadRes.data[0].id
        const res = await axiosInstance.post('/categories?populate=image',
            { data: { name, slug, image: imageId } },
            { headers: { Authorization: `Bearer ${token}` } }
        )
        return res.data.data
    } catch (err) {
        return rejectWithValue(err.response?.data?.error?.message || 'Failed to create category');
    }
})

// edit category 
export const updateCategory = createAsyncThunk('category/updateCategory', async ({ documentId, name, imageFile }, { getState, rejectWithValue }) => {
    try {
        const token = getState().auth.token
        let imageId = null
        if (imageFile) {
            const formData = new FormData()
            formData.append('files', imageFile)
            const uploadRes = await axiosInstance.post('/upload', formData, {
                headers: {
                    Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data'
                },
            })
            imageId = uploadRes.data[0].id
        }
        const payload = { name, slug: generateSlug(name) }
        if (imageId) payload.image = imageId
        const res = await axiosInstance.put(`/categories/${documentId}?populate=image`, { data: payload }, { headers: { Authorization: `Bearer ${token}` } })
        return res.data.data
    } catch (err) {
        return rejectWithValue(err.response?.data?.error?.message || 'Failed to update category');
    }
})

// delete Category
export const deleteCategory = createAsyncThunk('category/deleteCategory', async (documentId, { getState, rejectWithValue }) => {
    try {
        const token = getState().auth.token
        await axiosInstance.delete(`/categories/${documentId}`, { headers: { Authorization: `Bearer ${token}` } })
        return documentId
    } catch (err) {
        return rejectWithValue(err.response?.data?.error?.message || 'Failed to delete category');
    }
})

const categorySlice = createSlice({
    name: 'category',
    initialState,
    extraReducers: (builder) => {
        builder.addCase(CategoryFetch.pending, (state) => {
            state.status = 'loading'
        })
            .addCase(CategoryFetch.fulfilled, (state, action) => {
                state.status = 'succeeded'
                state.categoryData = action.payload
            })
            .addCase(CategoryFetch.rejected, (state, action) => {
                state.status = 'failed'
                state.error = action.payload
            })

            .addCase(createCategory.pending, (state) => {
                state.actionStatus = 'loading'
            })
            .addCase(createCategory.fulfilled, (state, action) => {
                state.actionStatus = 'succeeded'
                state.categoryData.push(action.payload)
            })
            .addCase(createCategory.rejected, (state, action) => {
                state.actionStatus = 'failed'
                state.error = action.payload
            })

            .addCase(updateCategory.fulfilled, (state, action) => {
                const index = state.categoryData.findIndex((c) => c.documentId === action.payload.documentId)
                if (index !== -1) state.categoryData[index] = action.payload
            })

            .addCase(deleteCategory.fulfilled, (state, action) => {
                state.categoryData = state.categoryData.filter((c) => c.documentId !== action.payload)
            })
    }
})

export const categoryReducer = categorySlice.reducer
