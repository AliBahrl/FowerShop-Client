import { useState } from "react"
import { FaShoppingCart } from "react-icons/fa"
import { FiEye, FiHeart } from "react-icons/fi"
import { Link, useNavigate } from 'react-router-dom'

import { addToCart } from "../features/cartSlice"
import { useDispatch, useSelector } from "react-redux"
import { toggleFavourite } from "../features/favouritesSlice"

function ItemCard({ item }) {
// favouriteFetch
  const dispatch = useDispatch()
  const favouriteItems = useSelector((state) => state.favourites.items)
  const isFavourite = favouriteItems.some((f) => f.id === item.id)

  // navigation
  const navigate = useNavigate()
   const { user, token } = useSelector((state) => state.auth)
   const isLoggedIn = Boolean(user && token)

   const handleAddToCart = ()=>{
     if(!isLoggedIn){
       alert('Please sign in first to add items to your cart')
       navigate('/login')
       return
     }
     dispatch(addToCart(item))
   }

   const handleAddToFavourite = ()=>{
     if(!isLoggedIn){
       alert('Please sign in first to add items to your Favourite')
       navigate('/login')
       return
     }
     dispatch(toggleFavourite(item))
   }
   
  // quickView
  const [quickViewOpen, setQuickViewOpen] = useState(false)

  const imageUrl = item.image?.url ? `${import.meta.env.VITE_API_URL}${item.image.url}` : null

  return (
    <>
      <div className="relative w-100 max-w-full mx-auto sm:mx-0 shrink-0 rounded-2xl overflow-hidden group bg-white/50  shadow-[0px_0px_5px] shadow-purple-400 ">
        {/* img */}
        <div className="relative w-full h-100 overflow-hidden ">
          <img
            src={imageUrl}
            alt={item.name}
            className="w-full h-full object-cover p-1 group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300">
          </div>
        </div>

        <div className="p-3  border-t border-purple-300 ">
          {/* info */}
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-xl text-black truncate ">{item.name}</h3>
            <p className="text-purple-600 font-bold mt-1">${item.price}</p>
          </div>
          <div className="flex gap-3 items-center justify-between opacity-100 pt-4 text-xl duration-300">
            {/* button */}
            <div className="flex  gap-2">
              <button
                onClick={handleAddToFavourite}
                className={`flex items-center justify-center rounded-4xl  py-2 px-3 shadow hover:scale-110  transition
                            ${isFavourite ? 'bg-red-300' : 'bg-red-700'}`}>
                <FiHeart className={isFavourite ? 'text-red-500 fill-red-500' : 'text-white'} />
              </button>
              <button onClick={() => setQuickViewOpen(true)}
                className='flex items-center justify-center rounded-4xl  py-2 px-3 shadow hover:scale-110 transition
                 bg-blue-700 hover:bg-blue-500 text-blue-200 hover:text-blue-900'>
                <FiEye />
              </button>
            </div>
            <button onClick={handleAddToCart} className="flex items-center justify-center rounded-4xl w-full p-2 shadow hover:scale-103 transition
             bg-purple-700 hover:bg-purple-500 text-purple-200 hover:text-purple-200">
              <FaShoppingCart />
            </button>
          </div>
          <Link to={`/item/${item.id}`} onClick={() => setQuickViewOpen(false)} className="block mt-3 text-center border border-gray-300 hover:scale-103 
           text-gray-800 rounded-full py-2 font-medium bg-pink-300 hover:bg-pink-400 hover:text-white transition">
            View Details
          </Link>
        </div>
      </div>
      {/* quickViewOpen */}
      {quickViewOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/30 px-4" onClick={() => setQuickViewOpen(false)}>
          <div onClick={(e) => e.stopPropagation()} className="bg-white rounded-3xl p-5 max-w-sm w-full relative shadow-xl">
            <img
              src={imageUrl}
              alt={item.name}
              className="w-full h-full object-cover p-1 group-hover:scale-105 transition-transform duration-300"
            />
            {/* info */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-xl text-black truncate ">{item.name}</h3>
              <p className="text-purple-600 font-bold mt-1">${item.price}</p>
            </div>
            {/* button */}
            <div className="flex gap-3">
              <button onClick={handleAddToCart}
                className="flex items-center justify-center rounded-4xl w-full p-2 shadow hover:scale-105 transition bg-purple-700 hover:bg-purple-300 text-purple-200 hover:text-purple-800">
                <FaShoppingCart />
              </button>
              <button
                onClick={() => dispatch(toggleFavourite(item))}
                className={`flex items-center justify-center rounded-4xl  py-2 px-3 shadow hover:scale-110 transition
                            ${isFavourite ? 'bg-red-300' : 'bg-red-700'}`}>
                <FiHeart className={isFavourite ? 'text-red-500 fill-red-500' : 'text-white'} />
              </button>
            </div>

            <Link to={`/item/${item.id}`} onClick={() => setQuickViewOpen(false)} className="block mt-3 text-center border border-gray-300 text-gray-700 rounded-full py-2 font-medium hover:bg-gray-50 transition">
              View Details
            </Link>
          </div>
        </div>
      )}
    </>
  )
}

export default ItemCard