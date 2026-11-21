import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import AllFlowers from './pages/AllFlowers'
import CategoryItems from './pages/CategoryItems'
import ItemDetails from './pages/ItemDetails'
import Favourites from './pages/Favourites'
import Cart from './pages/Cart'
import Order from './pages/Orders'
import Login from './pages/Login'
import Profile from './pages/Profile'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'
import { productFetch } from './features/productSlice'
import ScrollToTop from './global/ScrollToTop'

import ProtectedRoute from './dashboard/routes/ProtectedRoute'
import DashboardLayout from './dashboard/layout/DashboardLayout';
import DashboardOverview from './dashboard/pages/DashboardOverview';
import DashboardCategories from './dashboard/pages/DashboardCategory';
import DashboardProducts from './dashboard/pages/DashboardProducts'
import MainLayout from './layout/MainLayout'
import DashboardAbout from './dashboard/pages/DashboardAbout'
import DashboardFeedback from './dashboard/pages/DashboardFeedback'
import DashboardHero from './dashboard/pages/DashboardHero'
import DashboardOrders from './dashboard/pages/DashboardOrder'

import { fetchFavourites } from './features/favouritesSlice'
import { fetchCart } from './features/cartSlice'

function App() {

  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(productFetch())
  }, [dispatch])

  const { user, token } = useSelector((state) => state.auth)

  useEffect(() => {
    dispatch(productFetch())
  }, [dispatch])

  useEffect(() => {
    if (user && token) {
      dispatch(fetchFavourites())
      dispatch(fetchCart())
    }}, [user, token, dispatch])

    return (
      <>
        <ScrollToTop />

        <Routes>

          <Route element={<MainLayout />}>
            <Route path='/' element={<Home />} />
            <Route path='/flowers' element={<AllFlowers />} />
            <Route path='/category/:categoryName' element={<CategoryItems />} />
            <Route path='/item/:id' element={<ItemDetails />} />
            <Route path="/favourites" element={<Favourites />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/order" element={<Order />} />
            <Route path="/login" element={<Login />} />
            <Route path="/profile" element={<Profile />} />
          </Route>

          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<DashboardLayout />}>
              <Route index element={<DashboardOverview />} />
              <Route path="hero" element={<DashboardHero />} />
              <Route path="categories" element={<DashboardCategories />} />
              <Route path="products" element={<DashboardProducts />} />
              <Route path="about" element={<DashboardAbout />} />
              <Route path="feedback" element={<DashboardFeedback />} />
              <Route path="orders" element={<DashboardOrders />} />
            </Route>
          </Route>

        </Routes>

      </>
    )
  }

export default App
