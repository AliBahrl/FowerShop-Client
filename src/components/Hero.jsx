import { useEffect, useState } from 'react'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import { useDispatch, useSelector } from 'react-redux'
import { heroFetch } from '../features/heroSlice'
import { Link } from 'react-router-dom'

function Hero() {

  // hero fetch
  const dispatch = useDispatch()
  const { heroData, status } = useSelector((state) => state.hero)

  useEffect(() => {
    dispatch(heroFetch())
  }, [dispatch])


  // arrow
  const [index, setIndex] = useState(0)
  const [direction, setDirection] = useState('right')

  const next = () => {
    setDirection('right')
    setIndex((prev) => (prev + 1) % heroData.length)
  }
  const prev = () => {
    setDirection('left')
    setIndex((prev) => (prev - 1 + heroData.length) % heroData.length)
  }

// loading
  if (status === 'loading') {
    return (
      <section className='h-[75vh] flex items-center justify-center bg-gray-500'>
        <p className='text-4xl text-blue-700'>Loading.....</p>
      </section>
    )
  }

  // imgLink
  const currentSlide = heroData[index]
  if(!currentSlide) return null
  const imageUrl = currentSlide.image?.url
    ? `${import.meta.env.VITE_API_URL}${currentSlide.image.url}`
    : ' '
  const bgImgUrl = currentSlide.bg?.url
    ? `${import.meta.env.VITE_API_URL}${currentSlide.bg.url}`
    : ' '

  return (
    <section className={`relative m-auto rounded-b-4xl h-[75vh] overflow-hidden transition-colors duration-700  bg-cover  bg-no-repeat`} style={{ backgroundImage: `url(${bgImgUrl})` }}>
      <div key={index} className={`px-6 mt-10 md:mt-40 lg:mt-10 flex flex-col-reverse lg:flex-row-reverse justify-between items-center h-full`}>
          {/* img */}
        <div className={`w-full lg:w-[60%] z-0`}>
          <div className={`absolute lg:-right-20 lg:-bottom-40 -bottom-30 -right-20  -rotate-45 w-100 lg:w-150 ${direction === 'right' ? 'animate-slideInRight' : 'animate-slideInLeft'}`}>
            <img src={imageUrl} alt={currentSlide.name} className="w-full  object-contain mb-4" />
          </div>
        </div>
        {/* info */}
        <div className={`w-full z-10 lg:w-[60%] lg:mt-0 mt-25 px-5 lg:px-13   ${direction === 'right' ? 'animate-slideInRight' : 'animate-slideInLeft'}`}>
          <h2 className={`text-4xl md:text-7xl font-bold mb-6 lg:mb-15 ${currentSlide.textColor}`}>{currentSlide.name}</h2>
          <p className={`text-md lg:text-3xl mb-5 lg:mb-15 text-black`}>{currentSlide.description}</p>
          <Link to={`/category/${currentSlide.category?.slug}`} className={`${currentSlide.btnColor} text-white px-6 py-2 rounded-full hover:opacity-80 transition`}>
            Shop {currentSlide.name}s
          </Link>
        </div>
      </div>
      {/* arrow */}
      <button onClick={prev} className="absolute left-4 bottom-0 -translate-y-1/2 text-3xl text-gray-700 bg-white/60 rounded-full p-2 hover:bg-white transition">
        <FiChevronLeft />
      </button>
      <button onClick={next} className="absolute left-18 bottom-0 -translate-y-1/2 text-3xl text-gray-700 bg-white/60 rounded-full p-2 hover:bg-white transition">
        <FiChevronRight />
      </button>
    </section>
  )
}

export default Hero