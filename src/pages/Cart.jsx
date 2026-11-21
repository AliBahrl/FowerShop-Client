import { Link } from 'react-router-dom'
import { FiTrash2 } from 'react-icons/fi'
import { useDispatch, useSelector } from 'react-redux'
import { removeFromCart, updateQuantity } from '../features/cartSlice'

function Cart() {

  // cartFetch
  const dispatch = useDispatch()
  const cartItems = useSelector((state) => state.cart.cartItems)

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)

  return (
    <div className="w-[90%] m-auto my-10 mt-40">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">My Cart</h1>

      {cartItems.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-500 mb-4">Your cart is empty.</p>
          <Link to="/flowers" className="text-pink-600 font-medium hover:underline">
            Browse Flowers
          </Link>
        </div>
      ) : (
        <>
        {/* cartItems  */}
          <div className="flex flex-col gap-4 mb-8">
            {cartItems.map((item) => {
              const imageUrl = item.image?.url ? `${import.meta.env.VITE_API_URL}${item.image.url}` : ''

              return (
              <div key={item.id} className="flex flex-col gap-4 bg-white rounded-2xl shadow-sm p-3">
                  <div className='flex items-center gap-3'>
                    <img src={imageUrl} alt={item.name} className="w-20 h-20 object-cover rounded-xl" />
                    {/* cartInfo */}
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800">{item.name}</h3>
                      <p className="text-sm text-gray-500">{item.category?.name} · {item.color}</p>
                      <p className="text-pink-600 font-bold mt-1">${item.price}</p>
                    </div>
                  </div>
                <div className='flex items-center justify-end '>
                  {/* cartQuantity */}
                    <div className="flex items-center  border border-gray-300 rounded-full">
                      <button onClick={() => dispatch(updateQuantity({ id: item.id, delta: -1 }))} className="px-3 py-1 text-lg text-gray-600">−</button>
                      <span className="px-3">{item.quantity}</span>
                      <button onClick={() => dispatch(updateQuantity({ id: item.id, delta: 1 }))} className="px-3 py-1 text-lg text-gray-600">+</button>
                    </div>
                  {/* carttrash */}
                    <button onClick={() => dispatch(removeFromCart(item.id))} className="text-gray-400 hover:text-red-500 transition p-2">
                      <FiTrash2 />
                    </button>
                </div>
                </div>
              )
            })}
          </div>

          {/* summary */}
          <div className="bg-pink-50 rounded-2xl p-5 mb-6">
            <div className="flex justify-between text-lg font-semibold text-gray-800">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>

          {/* actions */}
          <div className="flex gap-3">
            <Link
              to="/flowers"
              className="flex-1 border border-gray-300 text-gray-700 rounded-full py-3 text-center font-medium hover:bg-gray-50 transition"
            >
              Continue Shopping
            </Link>
            <Link
              to="/order"
              className="flex-1 bg-pink-600 text-white rounded-full py-3 text-center font-medium hover:bg-pink-700 transition"
            >
              Order Now
            </Link>
          </div>
        </>
      )}
    </div>
  )
}

export default Cart