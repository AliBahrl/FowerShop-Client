import { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { CategoryFetch } from '../features/categorySlice'
import { Link } from 'react-router-dom'


function CategoriesCard() {
  //fetch
  const dispatch = useDispatch()
  const { categoryData, status } = useSelector((state) => state.category)
  useEffect(() => {
    dispatch(CategoryFetch())
  }, [dispatch])

  //scroll
  const scrollRef = useRef(null)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [scrollLeft, setScrollLeft] = useState(0)

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

  //loading
  if (status === 'loading') {
    return (
      <section className='h-[75vh] flex items-center justify-center bg-gray-500'>
        <p className='text-4xl text-blue-700'>Loading.....</p>
      </section>
    )
  }

  return (
    <section className="w-[90%] m-auto pb-10 ">
      <h2 className="dan text-3xl font-bold text-blue-900 mb-4 mt-10">Shop by Occasions</h2>
      {/* scroll */}
      <div
        ref={scrollRef}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        className={`flex gap-4  overflow-x-auto pb-3 px-4 scrollbar-hide ${isDragging ? 'cursor-grabbing select-none' : 'cursor-grab'
          }`}
          
      >
        {/* categoryFetch */}
        {categoryData.map((cat) => {
          const imageUrl = cat.image?.url ? `${import.meta.env.VITE_API_URL}${cat.image.url}` : ''
          return (
            <Link
              to={`/category/${cat.slug}`}
              draggable='false'
              key={cat.id}
              className="relative shrink-0 w-40 h-40 lg:w-60 lg:h-60 rounded-t-[40%] rounded-b-[10%] overflow-hidden group bg-blue-200 bg-linear-to-r from-[#53D0E0]  , to-[#0D5FB5]"
            >
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300">
              <img
                src={imageUrl}
                alt={cat.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
              </div>
              <div className="absolute inset-0 bg-black/10" />
              <span className="absolute text-sm md:text-2xl font-semibold bottom-4 left-4 text-purple-300 [text-shadow:1px_1px_0_black,-1px_1px_0_black,1px_-1px_0_black,-1px_-1px_0_black]  drop-shadow">
                {cat.name}
              </span>

            </Link>
          )
        })}
      </div>
    </section>
  )
}


export default CategoriesCard