import { useNavigate, useParams } from 'react-router-dom'
import { useRef, useState } from 'react'
import { FiHeart } from 'react-icons/fi'

import ItemCard from '../components/ItemCard'
import { useDispatch, useSelector } from 'react-redux'
import { addToCart } from '../features/cartSlice'
import { FaShoppingCart } from 'react-icons/fa'
import { toggleFavourite } from '../features/favouritesSlice'

function ItemDetails() {

  const { id } = useParams()
  const dispatch = useDispatch()

  // productFetch
  const { productData, status } = useSelector((state) => state.product)
  const item = productData.find((f) => f.id === Number(id))


  // navigation
  const navigate = useNavigate()
  const { user, token } = useSelector((state) => state.auth)
  const isLoggedIn = Boolean(user && token)

  const handleAddToCart = () => {
    if (!isLoggedIn) {
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
   

  // scroll 
  const scrollRef = useRef(null)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [scrollLeft, setScrollLeft] = useState(0)

  // favouriteItems
  const favouriteItems = useSelector((state) => state.favourites.items)
  const isFavourite = favouriteItems.some((f) => f.id === item.id)

  // relatedItems 
  const relatedItems = productData
    .filter((f) => f.category?.slug === item.category?.slug && f.id !== item.id)
    .slice(0, 5)

  // itemFound
  if (!item) {
    return (
      <div className="w-[90%] m-auto my-20 text-center text-gray-500">
        Item not found.
      </div>
    )
  }

  // scroll 
  const handleMouseDown = (e) => {
    setIsDragging(true)
    setStartX(e.pageX - scrollRef.current.offsetLeft)
    setScrollLeft(scrollRef.current.scrollLeft)
  }

  const handleMouseLeave = () => {
    setIsDragging(false)
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleMouseMove = (e) => {
    if (!isDragging) return
    e.preventDefault()
    const x = e.pageX - scrollRef.current.offsetLeft
    const walk = x - startX
    scrollRef.current.scrollLeft = scrollLeft - walk
  }

  // loaing 
  if (status === 'loading') {
    return (
      <section className='h-[75vh] flex items-center justify-center bg-gray-500'>
        <p className='text-4xl text-blue-700'>Loading.....</p>
      </section>
    )
  }

  const imageUrl = item.image?.url ? `${import.meta.env.VITE_API_URL}${item.image.url}` : null
  return (
    <div className="w-[90%] m-auto my-10 mt-15 md:mt-40">
      {/* main content */}
      <div className="w-full flex flex-col md:flex-row gap-8 ">
        {/* image */}
        <div className="w-[90%] md:w-[50%] mx-auto md:h-175 overflow-hidden ">
          <img
            src={imageUrl}
            alt={item.name}
            className="w-full h-full object-contain rounded-2xl"
          />
        </div>

        {/* info */}
        <div className="w-full md:w-[50%] flex flex-col">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">{item.name}</h1>
          {/* <p className="text-sm text-gray-500 mb-4">{item.category} · {item.color}</p> */}
          <p className="text-2xl font-bold text-pink-600 mb-4">${item.price}</p>

          <p className="text-gray-600 w-[80%] leading-relaxed mb-6">
            {item.description}
          </p>

          {/* actions */}
          <div className="flex gap-3 mt-10">
            <button onClick={handleAddToCart}
              className="flex items-center justify-center rounded-4xl text-3xl w-full py-3 shadow hover:scale-101 transition bg-purple-700 hover:bg-purple-300 text-purple-200 hover:text-purple-800">
              <FaShoppingCart />
            </button>
            <button
              onClick={handleAddToFavourite}
              className={`flex w-20 items-center justify-center rounded-4xl  py-2 px-3 shadow hover:scale-110  transition
                            ${isFavourite ? 'bg-red-300' : 'bg-red-700'}`}>
              <FiHeart className={isFavourite ? 'text-red-500 fill-red-500' : 'text-white'} />
            </button>
          </div>
        </div>
      </div>

      {/* related items */}
      <div className="mt-40">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Related Flowers</h2>
        <div
          ref={scrollRef}
          onMouseDown={handleMouseDown}
          onMouseLeave={handleMouseLeave}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
          className="flex gap-4 overflow-x-auto pb-3 pt-3 pl-3 scrollbar-hide">
          {relatedItems.map((f) => (
            <ItemCard key={f.id} item={f} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default ItemDetails