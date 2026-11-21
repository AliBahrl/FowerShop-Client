import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import axiosInstance from "../api/axiosInstance"


const initialState = {
    allOrders:[],
    myOrders: [],
    status: 'idle',
    error: null
}

//  Fetch all orders
export const fetchAllOrders = createAsyncThunk('order/fetchAllOrders', async (_, { getState, rejectWithValue }) => {
    try {
        const token = getState().auth.token
        const res = await axiosInstance.get('/orders?populate=*&sort=createdAt:desc', {
            headers: { Authorization: `Bearer ${token}` }
        })
        return res.data.data
    } catch (err) {
        return rejectWithValue(err.response?.data?.error?.message || 'Failed to fetch orders')
    }
})

// fetch my orders 
export const fetchMyOrders = createAsyncThunk('order/fetchMyOrders', async (_, { getState, rejectWithValue }) => {
    try {
        const token = getState().auth.token
        const userId = getState().auth.user.id
        const res = await axiosInstance.get(`/orders?filters[userId][$eq]=${userId}&populate=*&sort=createdAt:desc`, {
            headers: { Authorization: `Bearer ${token}` }
        })
        return res.data.data
    } catch (err) {
        return rejectWithValue(err.response?.data?.error?.message || 'Failed to fetch my orders')
    }
})

// add order 
export const createOrder = createAsyncThunk('order/createOrder', async ({ items, total }, { getState, rejectWithValue }) => {
    try {
        const token = getState().auth.token
        const user = getState().auth.user
        const res = await axiosInstance.post('/orders',
            { data: { items, total, stat: 'Processing', userId: user.id, username: user.username } },
            { headers: { Authorization: `Bearer ${token}` } }
        )
        return res.data.data
    } catch (err) {
        return rejectWithValue(err.response?.data?.error?.message || 'Failed to create order')
    }
})

// edit orders 
export const updateOrderStatus = createAsyncThunk('order/updateOrderStatus', async ({ documentId, stat }, { getState, rejectWithValue }) => {
    try {
        const token = getState().auth.token
        const res = await axiosInstance.put(`/orders/${documentId}?populate=*`,
            { data: { stat } },
            { headers: { Authorization: `Bearer ${token}` } }
        )
        return res.data.data
    } catch (err) {
        return rejectWithValue(err.response?.data?.error?.message || 'Failed to update order')
    }
})

const orderSlice = createSlice({
    name: 'order',
    initialState,
    reducers: {
        resetOrderStatus: (state) => {
            state.status = 'idle'
        },
    },
    extraReducers: (builder) => {
        builder.addCase(fetchAllOrders.pending, (state) => {
            state.status = 'loading'
        })
            .addCase(fetchAllOrders.fulfilled, (state, action) => {
                state.status = 'succeeded'
                state.allOrders = action.payload
            })
            .addCase(fetchAllOrders.rejected, (state, action) => {
                state.status = 'failed'
                state.error = action.payload
            })
            .addCase(fetchMyOrders.fulfilled, (state, action) => {
                state.myOrders = action.payload
            })
            .addCase(createOrder.pending, (state) => {
                state.status = 'loading'
            })
            .addCase(createOrder.fulfilled, (state, action) => {
                state.status = 'succeeded'
                state.myOrders.unshift(action.payload)
            })
            .addCase(createOrder.rejected, (state, action) => {
                state.status = 'failed'
                state.error = action.payload
            })
            .addCase(updateOrderStatus.fulfilled, (state, action) => {
                const index = state.allOrders.findIndex((o) => o.documentId === action.payload.documentId)
                if (index !== -1) state.allOrders[index] = action.payload
            })
    }
})

export const { resetOrderStatus } = orderSlice.actions
export const orderReducer = orderSlice.reducer