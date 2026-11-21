import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { createOrder, resetOrderStatus } from '../features/orderSlice'
import { clearCart } from '../features/cartSlice'

function Order() {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const cartItems = useSelector((state) => state.cart.cartItems)
  const { status } = useSelector((state) => state.order)

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)

  const handlePay = async () => {
    const result = await dispatch(createOrder({ items: cartItems, total }))
    if (createOrder.fulfilled.match(result)) {
      dispatch(clearCart())
    }
  }

  const handleContinueShopping = () => {
    dispatch(resetOrderStatus())
    navigate('/')
  }

  return (
    <div className="relative w-[90%] m-auto my-1 mt-40">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Confirm Your Order</h1>

      <div className="flex flex-col gap-4 mb-8">
        {cartItems.map((item) => (
          <div key={item.id} className="flex items-center gap-4 bg-white rounded-2xl shadow-sm p-3">
            <div className="flex-1">
              <h3 className="font-semibold text-gray-800">{item.name}</h3>
              <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
            </div>
            <p className="text-pink-600 font-bold">${item.price * item.quantity}</p>
          </div>
        ))}
      </div>

      <div className="bg-pink-50 rounded-2xl p-5 mb-6">
        <div className="flex justify-between text-lg font-semibold text-gray-800">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </div>

      {status === 'failed' && (
        <p className="text-red-500 text-sm text-center mb-4">
          Something went wrong. Please try again.
        </p>
      )}

      <div className="flex gap-3">
        <Link to="/cart" className="flex-1 border border-gray-300 text-gray-700 rounded-full py-3 text-center font-medium hover:bg-gray-50 transition">
          Back to Cart
        </Link>
        <button
          onClick={handlePay}
          disabled={status === 'loading'}
          className="flex-1 bg-pink-600 text-white rounded-full py-3 font-medium hover:bg-pink-700 transition disabled:opacity-50"
        >
          {status === 'loading' ? 'Processing...' : 'Pay'}
        </button>
      </div>

      {status === 'succeeded' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/30">
          <div className="bg-white rounded-3xl p-8 mx-4 max-w-sm text-center shadow-xl">
            <h2 className="text-xl font-bold text-gray-800 mb-2">Order Confirmed! 🌸</h2>
            <p className="text-gray-600 mb-6">Your order will be delivered in 3 days.</p>
            <button
              onClick={handleContinueShopping}
              className="bg-pink-600 text-white rounded-full py-3 px-6 font-medium hover:bg-pink-700 transition"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Order