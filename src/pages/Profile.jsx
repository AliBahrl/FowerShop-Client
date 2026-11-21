import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { FiUser, FiPackage, FiSettings, FiLogOut } from 'react-icons/fi'
import { logout } from '../features/authSlice'
import { fetchMyOrders } from '../features/orderSlice'

import adminImg from '../assets/avatar/admin.png'
import userImg from '../assets/avatar/user.png'

function Profile() {

  const navigate = useNavigate()
  const dispatch = useDispatch()

  const { user, token } = useSelector((state) => state.auth)
  const { myOrders } = useSelector((state) => state.order)
  const [activeTab, setActiveTab] = useState('info')

  const handleLogout = () => {
    dispatch(logout())
    navigate('/')
  }

  useEffect(() => {
    if (activeTab === 'orders' && token) {
      dispatch(fetchMyOrders())
    }
  }, [activeTab, token, dispatch])

  const tabs = [
    { id: 'info', label: 'My Info', icon: <FiUser /> },
    { id: 'orders', label: 'Order History', icon: <FiPackage /> },
    { id: 'settings', label: 'Settings', icon: <FiSettings /> },
    { id: 'logout', label: 'Logout', icon: <FiLogOut /> },
  ]

  if (!user) {
    return (
      <div className="w-[90%] m-auto my-20 text-center text-gray-500">
        Please log in to view your profile.
      </div>
    )
  }

  return (
    <div className="w-[90%] m-auto my-10 mt-40">
      <div className="flex flex-col items-center mb-8">
        <img
          src={['adminflowerstore@gmail.com', 'adminonlyview@gmail.com'].includes(user?.email) ? adminImg : userImg}
          alt="avatar"
          className="w-20 h-20 rounded-full object-cover mb-3"
        />
        <h1 className="text-xl font-bold text-gray-800">{user.username}</h1>
        <p className="text-sm text-gray-500">{user.email}</p>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-hide">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => (tab.id === 'logout' ? handleLogout() : setActiveTab(tab.id))}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition ${activeTab === tab.id && tab.id !== 'logout'
              ? 'bg-pink-600 text-white'
              : 'bg-gray-100 text-gray-600'
              }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-sm p-5">
        {activeTab === 'info' && (
          <div className="flex flex-col gap-3">
            <div>
              <p className="text-xs text-gray-500">Username</p>
              <p className="text-gray-800 font-medium">{user.username}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Email</p>
              <p className="text-gray-800 font-medium">{user.email}</p>
            </div>
            <button className="mt-2 self-start text-pink-600 text-sm font-medium hover:underline">
              Edit Info
            </button>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="flex flex-col gap-3">
            {myOrders.length === 0 ? (
              <p className="text-gray-500 text-sm">No orders yet.</p>
            ) : (
              myOrders.map((order) => (
                <div key={order.documentId} className="flex items-center justify-between border border-gray-100 rounded-xl p-3">
                  <div>
                    <p className="font-medium text-gray-800">Order #{order.id}</p>
                    <p className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-pink-600 font-bold">${order.total}</p>
                    <p className="text-xs text-gray-500">{order.stat}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="flex flex-col gap-4">
            <label className="flex items-center justify-between text-sm text-gray-700">
              Email Notifications
              <input type="checkbox" defaultChecked className="w-4 h-4 accent-pink-600" />
            </label>
            <button className="mt-2 self-start text-red-500 text-sm font-medium hover:underline">
              Delete Account
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Profile