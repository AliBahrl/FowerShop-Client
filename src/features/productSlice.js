import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import axiosInstance from "../api/axiosInstance"


const initialState = {
    productData: [],
    status: 'idle',
    error: null,
    actionStatus: 'idle',
}
// product fetch 
export const productFetch = createAsyncThunk('product/productFetch', async (_, { rejectWithValue }) => {
    try {
        const res = await axiosInstance.get('/products?populate=*&pagination[pageSize]=1000')
        return res.data.data
    } catch (err) {
        return rejectWithValue(err.response?.data.error.message || 'Failed to fetch products')
    }
})
// add Products 
export const createProducts = createAsyncThunk('product/createProduct', async ({ name, price, color, description, categoryId, topSell, stock, imageFile }, { getState, rejectWithValue }) => {
    try {
        const token = getState().auth.token
        const formData = new FormData()
        if (!imageFile) {
            return rejectWithValue('Please select an image')
        }
        formData.append('files', imageFile)
        const uploadRes = await axiosInstance.post('/upload', formData, {
            headers: { Authorization: `Bearer ${token}` }
        })
        const imageId = uploadRes.data[0].id
        const res = await axiosInstance.post(`/products?populate=*`,
            { data: { name, price, color, description, category: categoryId, topSell, stock, image: imageId } },
            { headers: { Authorization: `Bearer ${token}` } }
        )
        return res.data.data
    } catch (err) {
        return rejectWithValue(err.response?.data?.error?.message || 'Failed to create product')
    }
})

// edit Products 
export const updateProducts = createAsyncThunk('products/updateProducts', async ({ documentId, name, price, color, description, categoryId, topSell, stock, imageFile }, { getState, rejectWithValue }) => {
    try {
        const token = getState().auth.token
        let imageId = null
        if (imageFile) {
            const formData = new FormData()
            formData.append('files', imageFile)
            const uploadRes = await axiosInstance.post('/upload', formData, {
                headers: { Authorization: `Bearer ${token}` }
            })
            imageId = uploadRes.data[0].id
        }
        const payload = { name, price, color, description, category: categoryId, topSell, stock }
        if (imageId) payload.image = imageId
        const res = await axiosInstance.put(`/products/${documentId}?populate=*`,
            { data: payload }, { headers: { Authorization: `Bearer ${token}` } }
        )
        return res.data.data
    } catch (err) {
        return rejectWithValue(err.response?.data?.error?.message || 'Failed to update product')
    }
})
// delete Products 
export const deleteProduct = createAsyncThunk('product/deleteProduct', async (documentId, { getState, rejectWithValue }) => {
    try {
        const token = getState().auth.token
        await axiosInstance.delete(`/products/${documentId}`, { headers: { Authorization: `Bearer ${token}` } })
        return documentId
    } catch (err) {
        return rejectWithValue(err.response?.data?.error?.message || 'Failed to delete product')
    }
})

const productSlice = createSlice({
    name: 'product',
    initialState,
    extraReducers: (builder) => {
        builder.addCase(productFetch.pending, (state) => {
            state.status = 'loading'
        })
            .addCase(productFetch.fulfilled, (state, action) => {
                state.status = 'succeeded'
                state.productData = action.payload
            })
            .addCase(productFetch.rejected, (state, action) => {
                state.status = 'failed'
                state.error = action.payload
            })
            .addCase(createProducts.pending, (state) => {
                state.actionStatus = 'loading'
            })
            .addCase(createProducts.fulfilled, (state, action) => {
                state.actionStatus = 'succeeded'
                state.productData.push(action.payload)
            })
            .addCase(createProducts.rejected, (state, action) => {
                state.actionStatus = 'failed'
                state.error = action.payload
            })
            .addCase(updateProducts.fulfilled, (state, action) => {
                const index = state.productData.findIndex((p) => p.documentId === action.payload.documentId)
                if (index !== -1) state.productData[index] = action.payload
            })
            .addCase(deleteProduct.fulfilled, (state, action) => {
                state.productData = state.productData.filter((p) => p.documentId !== action.payload)
            })
    }
})

export const productReducer = productSlice.reducer
