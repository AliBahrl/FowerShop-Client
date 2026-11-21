import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import axiosInstance from "../api/axiosInstance"

const initialState = {
    cartItems: [],
    _cartId: null, 
    status: 'idle',
    error: null,
}

export const fetchCart = createAsyncThunk('cart/fetch', async (_, { getState, rejectWithValue }) => {
    try {
        const token = getState().auth.token
        const userId = getState().auth.user?.id
        if (!token || !userId) return { items: [], cartId: null }

        const res = await axiosInstance.get(
            `/carts?filters[userId][$eq]=${userId}`,
            { headers: { Authorization: `Bearer ${token}` } }
        )
        const record = res.data.data[0]
        return { items: record?.items || [], cartId: record?.documentId || null }
    } catch (err) {
        return rejectWithValue(err.response?.data?.error?.message || 'Failed to fetch cart')
    }
})


const persistCart = async (newItems, getState) => {
    const token = getState().auth.token
    const userId = getState().auth.user?.id
    const existingCartId = getState().cart._cartId

    if (existingCartId) {
        await axiosInstance.put(`/carts/${existingCartId}`,
            { data: { items: newItems } },
            { headers: { Authorization: `Bearer ${token}` } }
        )
        return existingCartId
    } else {
        const res = await axiosInstance.post('/carts',
            { data: { items: newItems, userId } },
            { headers: { Authorization: `Bearer ${token}` } }
        )
        return res.data.data.documentId
    }
}

export const addToCart = createAsyncThunk('cart/add', async (item, { getState, rejectWithValue }) => {
    const token = getState().auth.token
    const userId = getState().auth.user?.id
    if (!token || !userId) return rejectWithValue('Please sign in to use the cart')

    try {
        const current = getState().cart.cartItems
        const existing = current.find((i) => i.id === item.id)
        const newItems = existing
            ? current.map((i) => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i)
            : [...current, { ...item, quantity: 1 }]

        const cartId = await persistCart(newItems, getState)
        return { items: newItems, cartId }
    } catch (err) {
        return rejectWithValue(err.response?.data?.error?.message || 'Failed to add to cart')
    }
})

export const updateQuantity = createAsyncThunk('cart/updateQuantity', async ({ id, delta }, { getState, rejectWithValue }) => {
    const token = getState().auth.token
    if (!token) return rejectWithValue('Please sign in to use the cart')

    try {
        const current = getState().cart.cartItems
        const newItems = current.map((i) =>
            i.id === id ? { ...i, quantity: Math.max(1, i.quantity + delta) } : i
        )
        const cartId = await persistCart(newItems, getState)
        return { items: newItems, cartId }
    } catch (err) {
        return rejectWithValue(err.response?.data?.error?.message || 'Failed to update cart')
    }
})

export const removeFromCart = createAsyncThunk('cart/remove', async (id, { getState, rejectWithValue }) => {
    const token = getState().auth.token
    if (!token) return rejectWithValue('Please sign in to use the cart')

    try {
        const current = getState().cart.cartItems
        const newItems = current.filter((i) => i.id !== id)
        const cartId = await persistCart(newItems, getState)
        return { items: newItems, cartId }
    } catch (err) {
        return rejectWithValue(err.response?.data?.error?.message || 'Failed to update cart')
    }
})

export const clearCart = createAsyncThunk('cart/clear', async (_, { getState, rejectWithValue }) => {
    const token = getState().auth.token
    if (!token) return rejectWithValue('Please sign in to use the cart')

    try {
        const cartId = await persistCart([], getState)
        return { items: [], cartId }
    } catch (err) {
        return rejectWithValue(err.response?.data?.error?.message || 'Failed to clear cart')
    }
})

const CartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchCart.pending, (state) => {
                state.status = 'loading'
            })
            .addCase(fetchCart.fulfilled, (state, action) => {
                state.status = 'succeeded'
                state.cartItems = action.payload.items
                state._cartId = action.payload.cartId
            })
            .addCase(fetchCart.rejected, (state, action) => {
                state.status = 'failed'
                state.error = action.payload
            })
            .addMatcher(
                (action) => [addToCart.fulfilled.type, updateQuantity.fulfilled.type, removeFromCart.fulfilled.type, clearCart.fulfilled.type].includes(action.type),
                (state, action) => {
                    state.cartItems = action.payload.items
                    state._cartId = action.payload.cartId
                }
            )
            .addMatcher(
                (action) => [addToCart.rejected.type, updateQuantity.rejected.type, removeFromCart.rejected.type, clearCart.rejected.type].includes(action.type),
                (state, action) => {
                    state.error = action.payload
                }
            )
    }
})

export const cartReducer = CartSlice.reducer
