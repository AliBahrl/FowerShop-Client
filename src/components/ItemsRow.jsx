import { useRef, useState } from 'react'
import ItemCard from './ItemCard'
import { MdOutlineReadMore } from 'react-icons/md'
import { Link } from 'react-router-dom'

function CategoryRow({ title, items, link }) {

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

  return (
    <section className="w-[90%] m-auto my-15 ">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-5xl font-bold text-blue-900 dan">{title}</h2>
        {
          link && (
            <Link to={link} className="text-pink-600 font-medium text-xl hover:underline flex items-center gap-1">
              More <MdOutlineReadMore className='text-2xl' />
            </Link>
          )
        }
      </div>

      <div
        ref={scrollRef}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        className={`flex gap-5 pb-2 pt-2 overflow-x-auto px-4 scrollbar-hide ${isDragging ? 'cursor-grabbing select-none' : 'cursor-grab'}`}>
        {items.map((item) => (
          <ItemCard key={item.id} item={item} />
        ))}
      </div>
    </section>
  )
}

export default CategoryRow