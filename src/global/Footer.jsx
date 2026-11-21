import { FaInstagram, FaFacebookF, FaWhatsapp, FaPhoneAlt, FaShoppingCart } from 'react-icons/fa'
import logoImg from '../assets/logo/logo1.png'
import { MdEmail } from 'react-icons/md'
import { Link } from 'react-router-dom'
import { BiSolidCategory } from 'react-icons/bi'
import { TbBasketHeart } from 'react-icons/tb'
import { TiHome } from 'react-icons/ti'

function Footer() {
  return (
    <footer className="bg-[#d8ccec] mt-16 pt-10 pb-6 px-6 shadow-[0px_0px_10px] shadow-purple-400">
      <div className="w-[90%] m-auto grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
        {/* logo */}
        <div>
          <div className='flex items-center'>
            <img src={logoImg} alt="logo" className='w-25 mb-5' />
            <div className="dan font-extrabold text-5xl text-blue-900 ">
              Flowers
            </div>
          </div>
          <p className="text-purple-700 text-md max-w-2xs leading-relaxed">
            Fresh flowers, thoughtfully arranged and delivered with care —
            for every moment that matters.
          </p>
        </div>

        {/* quick links */}
        <div>
          <h4 className="dan font-extrabold text-4xl text-blue-800 mb-5">Quick Links</h4>
          <Link to='/' className='flex items-center gap-2 text-2xl text-purple-700 hover:text-blue-500 duration-400'><TiHome />Home</Link>
          <Link to='/flowers' className='flex items-center gap-2 text-2xl text-purple-700 hover:text-blue-500 duration-400'><BiSolidCategory />All Flowers</Link>
          <Link to='/favourites' className='flex items-center gap-2 text-2xl text-purple-700 hover:text-blue-500 duration-400'><TbBasketHeart/>Favourites</Link>
          <Link to='/cart' className="flex items-center gap-2 text-2xl text-purple-700 hover:text-blue-500 duration-400">
            <FaShoppingCart />Cart
          </Link>
        </div>

        {/* contact + social */}
        <div>
          <h4 className="dan font-extrabold text-4xl text-blue-800 mb-5">Get in Touch</h4>
          <div className='flex flex-col gap-3'>
            <div className='flex items-center gap-3 text-xl'>
              <i ><MdEmail /></i>
              <p className="text-purple-700 mb-1">contact@flowers.com</p>
            </div>
            <div className='flex items-center gap-3 text-xl'>
              <i className='mb-5'><FaPhoneAlt /></i>
              <p className="text-purple-700 mb-4">+961 1234567</p>
            </div>
          </div>
          <div className="flex ml-1 mt-2 gap-15 text-3xl text-blue-500 ">
            <a href="#" className="text-purple-700 hover:text-blue-500 transition"><FaInstagram /></a>
            <a href="#" className="text-purple-700 hover:text-blue-500 transition"><FaFacebookF /></a>
            <a href="#" className="text-purple-700 hover:text-blue-500 transition"><FaWhatsapp /></a>
          </div>
        </div>
      </div>

      {/* bottom bar */}
      <div className="border-t border-pink-400 mt-4 pt-4 text-center text-xs text-blue-800">
        © {new Date().getFullYear()} Flowers. All rights reserved.
      </div>
    </footer>
  )
}

export default Footer