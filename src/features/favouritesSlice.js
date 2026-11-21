import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import axiosInstance from "../api/axiosInstance"

const initialState = {
    items: [], 
    status: 'idle',
    error: null,
}

// fetch 
export const fetchFavourites = createAsyncThunk('favourites/fetch', async (_, { getState, rejectWithValue }) => {
    try {
        const token = getState().auth.token
        const userId = getState().auth.user?.id
        if (!token || !userId) return []

        const res = await axiosInstance.get(
            `/favourites?filters[userId][$eq]=${userId}&populate[product][populate]=*`,
            { headers: { Authorization: `Bearer ${token}` } }
        )
        return res.data.data
            .filter((f) => f.product)
            .map((f) => ({ ...f.product, _favouriteId: f.documentId }))
    } catch (err) {
        return rejectWithValue(err.response?.data?.error?.message || 'Failed to fetch favourites')
    }
})

// add or remove 
export const toggleFavourite = createAsyncThunk('favourites/toggle', async (item, { getState, rejectWithValue }) => {
    try {
        const token = getState().auth.token
        const userId = getState().auth.user?.id
        if (!token || !userId) return rejectWithValue('Please log in to use favourites')

        const existing = getState().favourites.items.find((f) => f.id === item.id)

        if (existing) {
            await axiosInstance.delete(`/favourites/${existing._favouriteId}`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            return { action: 'remove', productId: item.id }
        }

        await axiosInstance.post(
            '/favourites',
            { data: { product: item.id, userId } },
            { headers: { Authorization: `Bearer ${token}` } }
        )
        const res = await axiosInstance.get(
            `/favourites?filters[userId][$eq]=${userId}&filters[product][id][$eq]=${item.id}`,
            { headers: { Authorization: `Bearer ${token}` } }
        )
        const favouriteId = res.data.data[0]?.documentId
        return { action: 'add', product: { ...item, _favouriteId: favouriteId } }
    } catch (err) {
        return rejectWithValue(err.response?.data?.error?.message || 'Failed to update favourites')
    }
})

const favouritesSlice = createSlice({
    name: 'favourites',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchFavourites.pending, (state) => {
                state.status = 'loading'
            })
            .addCase(fetchFavourites.fulfilled, (state, action) => {
                state.status = 'succeeded'
                state.items = action.payload
            })
            .addCase(fetchFavourites.rejected, (state, action) => {
                state.status = 'failed'
                state.error = action.payload
            })
            .addCase(toggleFavourite.fulfilled, (state, action) => {
                if (action.payload.action === 'add') {
                    state.items.push(action.payload.product)
                } else {
                    state.items = state.items.filter((f) => f.id !== action.payload.productId)
                }
            })
            .addCase(toggleFavourite.rejected, (state, action) => {
                state.error = action.payload
            })
    },
})

export const favouritesReducer = favouritesSlice.reducer
