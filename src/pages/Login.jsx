import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { registerUser, loginUser } from '../features/authSlice'
import { BiShow } from 'react-icons/bi'
import { PiEyeClosed } from 'react-icons/pi'

function Login() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { status, error } = useSelector((state) => state.auth)

  const [showPassword , setShowPassword] = useState(false)

  const [mode, setMode] = useState('login')
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', confirmPassword: '',
  })

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (mode === 'signup') {
      if (formData.password !== formData.confirmPassword) {
        alert('Passwords do not match')
        return
      }
      const result = await dispatch(registerUser({
        username: formData.name,
        email: formData.email,
        password: formData.password,
      }))
      if (registerUser.fulfilled.match(result)) navigate('/')
    } else {
      const result = await dispatch(loginUser({
        identifier: formData.email,
        password: formData.password,
      }))
      if (loginUser.fulfilled.match(result)) navigate('/')
    }
  }

  return (
    <div className="w-[90%] max-w-md m-auto my-16 mt-40">
      <div className="flex bg-gray-100 rounded-full p-1 mb-8">
        <button onClick={() => setMode('login')} className={`flex-1 py-2 rounded-full text-sm font-medium transition ${mode === 'login' ? 'bg-pink-600 text-white' : 'text-gray-600'}`}>Login</button>
        <button onClick={() => setMode('signup')} className={`flex-1 py-2 rounded-full text-sm font-medium transition ${mode === 'signup' ? 'bg-pink-600 text-white' : 'text-gray-600'}`}>Sign Up</button>
      </div>

      <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        {mode === 'login' ? 'Welcome Back' : 'Create Account'}
      </h1>

      {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {mode === 'signup' && (
          <input type="text" name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} required className="border border-gray-300 rounded-full px-4 py-3 outline-none focus:border-pink-500 transition" />
        )}
        <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required className="border border-gray-300 rounded-full px-4 py-3 outline-none focus:border-pink-500 transition" />
         <div className=' relative'>
           <input type={showPassword ? 'text' : "password"} name="password" placeholder="Password" value={formData.password} onChange={handleChange} required className=" border  w-full border-gray-300 rounded-full px-4 py-3 outline-none focus:border-pink-500 transition" />
           <div className='absolute right-4 top-1/2 -translate-1/2 ' onClick={()=>setShowPassword(!showPassword)}>{showPassword ? <BiShow /> : <PiEyeClosed />}</div>
         </div>
        {mode === 'signup' && (
          <input type="password" name="confirmPassword" placeholder="Confirm Password" value={formData.confirmPassword} onChange={handleChange} required className="border border-gray-300 rounded-full px-4 py-3 outline-none focus:border-pink-500 transition" />
        )}
        <button type="submit" disabled={status === 'loading'} className="bg-pink-600 text-white rounded-full py-3 font-medium hover:bg-pink-700 transition mt-2 disabled:opacity-50">
          {status === 'loading' ? 'Please wait...' : mode === 'login' ? 'Login' : 'Sign Up'}
        </button>
      </form>
    </div>
  )
}

export default Login