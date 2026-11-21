import { useDispatch, useSelector } from 'react-redux'
import { FiHeart, FiShoppingCart } from 'react-icons/fi'
import { toggleFavourite } from '../features/favouritesSlice'
import { addToCart } from '../features/cartSlice'
import { useNavigate } from 'react-router-dom'

function Favourites() {
  // fetch 
  const dispatch = useDispatch()
  const favourites = useSelector((state) => state.favourites.items)

  // navigation
  const navigate = useNavigate()
  const { user, token } = useSelector((state) => state.auth)
  const isLoggedIn = Boolean(user && token)



  return (
    <div className="w-[90%] m-auto my-10 mt-40">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">My Favourites</h1>

      {favourites.length === 0 ? (
        <p className="text-gray-500 text-center py-16">
          You haven't added any flowers to your favourites yet.
        </p>
      ) : (
        <div className="flex flex-col gap-4">
          {favourites.map((item) => {
            const imageUrl = item.image?.url ? `${import.meta.env.VITE_API_URL}${item.image.url}` : ''
            const handleAddToCart = () => {
              if (!isLoggedIn) {
                alert('Please sign in first to add items to your cart')
                navigate('/login')
                return
              }
              dispatch(addToCart(item))
            }

            const handleAddToFavourite = () => {
              if (!isLoggedIn) {
                alert('Please sign in first to add items to your Favourite')
                navigate('/login')
                return
              }
              dispatch(toggleFavourite(item))
            }


            return (
              <div key={item.id} className="flex items-center gap-4 bg-white rounded-2xl shadow-sm p-3">
                <img src={imageUrl} alt={item.name} className="w-20 h-20 object-cover rounded-xl" />
                {/* favouriteInfo */}
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800">{item.name}</h3>
                  <p className="text-sm text-gray-500">{item.category?.name} · {item.color}</p>
                  <p className="text-pink-600 font-bold mt-1">${item.price}</p>
                </div>

                {/* favouriteInfoBtn */}
                <div className="flex flex-col gap-2 items-center">
                  <button onClick={handleAddToFavourite} className="text-xl text-red-500">
                    <FiHeart className="fill-red-500" />
                  </button>
                  <button onClick={handleAddToCart} className="text-gray-600 border border-gray-300 rounded-full p-2 hover:bg-gray-50 transition">
                    <FiShoppingCart />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default Favourites