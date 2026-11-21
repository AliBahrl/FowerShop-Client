import { configureStore } from '@reduxjs/toolkit'
import { heroReducer } from '../features/heroSlice'
import { categoryReducer } from '../features/categorySlice'
import { productReducer } from '../features/productSlice'
import { authReducer } from '../features/authSlice'
import { cartReducer } from '../features/cartSlice'
import { orderReducer } from '../features/orderSlice'
import { favouritesReducer } from '../features/favouritesSlice'
import { aboutReducer } from '../features/AboutSlice'
import { feedbackReducer } from '../features/feadbackSlice'
import { overviewReducer } from '../features/overview'

export const store = configureStore({
  reducer: {
    hero: heroReducer,
    category: categoryReducer,
    product: productReducer,
    auth: authReducer,
    cart: cartReducer,
    order: orderReducer,
    favourites:favouritesReducer,
    about: aboutReducer,
    feedback: feedbackReducer,
    overview:overviewReducer,
  },
})