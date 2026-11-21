import { useState } from 'react'
import { BiSolidCategory } from 'react-icons/bi'
import { FaChartPie, FaShoppingCart } from 'react-icons/fa'
import { IoPerson, IoPersonAddSharp } from 'react-icons/io5'
import { LuScanSearch } from 'react-icons/lu'
import { TbBasketHeart } from 'react-icons/tb'
import logoImg from '../assets/logo/logo1.png'
import { FiX } from 'react-icons/fi'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import useAuth from '../dashboard/hooks/useAuth'

function NavBar() {
  // user
  const { user } = useSelector((state) => state.auth)
  const { productData } = useSelector((state) => state.product)
  const isLoggedIn = !!user
  const { isAdminArea } = useAuth();

  // search
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  const searchResults =
    searchTerm.trim() === ''
      ? []
      : productData.filter((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      )

  const closeSearch = () => {
    setSearchOpen(false)
    setSearchTerm('')
  }

  // cart
  const cartItems = useSelector((state) => state.cart.cartItems)
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0)





  return (
    <nav className="blurfilter w-[90%] sm:w-[80%] m-auto fixed left-0 right-0 top-0 z-50 bg-black/40  shadow-2xl rounded-b-4xl px-4 lg:px-8 py-3">
      <div className="flex justify-between items-center">
        {/* logo */}
        <Link to='/' className='flex items-center'>
          <div className='w-[40%]  md:w-[25%]'>
            <img src={logoImg} alt="logo" className='w-full' />
          </div>
          <div className="dan font-extrabold text-5xl text-blue-900 hidden md:block">
            Flowers
          </div>
        </Link>

        {/* icons group */}
        <div className="flex items-center gap-6 lg:gap-20 text-2xl sm:text-4xl text-blue-400">
          <Link to='/flowers' className='hover:text-purple-600 duration-400'><BiSolidCategory /></Link>
          <button onClick={() => setSearchOpen(!searchOpen)} className='hover:text-purple-600 duration-400'>
            <LuScanSearch />
          </button>
          <Link to='/favourites' className='hover:text-purple-600 duration-400'><TbBasketHeart /></Link>
          <Link to='/cart' className="relative hover:text-purple-600 duration-400">
            <FaShoppingCart />

            <span className="absolute -top-2.5 -right-2 bg-blue-950 dan -z-1 text-blue-100 text-[10px] px-1 py-0.5 flex items-center justify-center rounded-full">
              {cartCount}
            </span>
          </Link>
          {isAdminArea && (
            <Link to="/dashboard" className="hover:text-purple-600 duration-400">
              <FaChartPie />
            </Link>
          )}
          <Link to={isLoggedIn ? '/profile' : '/login'} className='hover:text-purple-600 duration-400'>
            {!isLoggedIn ? <IoPersonAddSharp /> : <IoPerson />}
          </Link>
        </div>
      </div>

      {/* search dropdown */}
      {searchOpen && (
        <div className="absolute left-0 right-0 top-full mt-2 mx-auto z-40">
          <div className="blurfilter relative w-fit md:w-full bg-black/60  shadow-2xl  rounded-3xl  p-3">
            <div className="flex items-center gap-2 ">
              <input
                type="text"
                autoFocus
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search Flowers...."
                className="flex-1 border border-blue-400 rounded-full px-4 py-2 outline-none text-blue-400 focus:border-purple-600 placeholder:text-puple-400 focus:text-blue-400"
              />
              <button onClick={closeSearch} className="text-blue-200 text-xl px-2">
                <FiX />
              </button>
            </div>

            {/* results */}
            {searchTerm.trim() !== '' && (
              <div className="max-h-64  overflow-y-auto flex flex-col gap-1">
                {searchResults.length > 0 ? (

                  searchResults.map((item) => {
                    const imageUrl = item.image?.url ? `${import.meta.env.VITE_API_URL}${item.image.url}` : ''

                    return (
                      <Link
                        key={item.id}
                        to={`/item/${item.id}`}
                        onClick={closeSearch}
                        className="flex items-center gap-3 p-2 rounded-xl hover:bg-blue-200 text-purple-300 hover:text-purple-900 transition "
                      >
                        <img src={imageUrl} alt={item.name} className="w-10 h-10 object-cover rounded-lg" />
                        <span className="text-sm  ">{item.name}</span>
                      </Link>
                    )
                  })
                ) : (
                  <p className="text-sm text-purple-400 p-2 mt-2">No results found.</p>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}

export default NavBar