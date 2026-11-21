import { useParams } from 'react-router-dom'
import { useState } from 'react'
import { FiFilter, FiX } from 'react-icons/fi'
import ItemCard from '../components/ItemCard'
import { useSelector } from 'react-redux'

function CategoryItems() {

  // fetch
  const { categoryName: slug } = useParams()
  const { productData, status } = useSelector((state) => state.product)

  // filter 
  const [filterOpen, setFilterOpen] = useState(false)
  const [selectedColor, setSelectedColor] = useState('All')
  const [sortBy, setSortBy] = useState('none')

  const categoryItems = productData.filter((item) => item.category?.slug === slug)
  const categoryDisplayName = categoryItems[0]?.category?.name || slug
  const colors = [...new Set(categoryItems.map((item) => item.color))]

  let filteredItems = categoryItems.filter((item) =>
    selectedColor === 'All' ? true : item.color === selectedColor
  )

  filteredItems = [...filteredItems].sort((a, b) => {
    if (sortBy === 'priceLow') return a.price - b.price
    if (sortBy === 'priceHigh') return b.price - a.price
    if (sortBy === 'nameAZ') return a.name.localeCompare(b.name)
    if (sortBy === 'nameZA') return b.name.localeCompare(a.name)
    return 0
  })

  const resetFilters = () => {
    setSelectedColor('All')
    setSortBy('none')
  }

  // loading 
  if (status === 'loading') {
    return (
      <section className='h-[75vh] flex items-center justify-center bg-gray-500'>
        <p className='text-4xl text-blue-700'>Loading.....</p>
      </section>
    )
  }
  return (
    <div className="w-[90%] m-auto my-10 mt-40">
      <h1 className="text-5xl dan text-blue-800 mb-3">{categoryDisplayName}</h1>
      {/* filter  */}
      <div className="relative flex justify-end mb-2">
        <button onClick={() => setFilterOpen(!filterOpen)} className="text-2xl text-purple-600 p-2">
          <FiFilter />
        </button>

        {filterOpen && (
          <div className="absolute top-full right-0 mt-1 w-72 bg-white shadow-lg rounded-2xl p-4 z-40 max-h-[70vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-blue-800">Filters</h3>
              <button onClick={() => setFilterOpen(false)} className="text-gray-500">
                <FiX />
              </button>
            </div>
            {/* color  */}
            <div className="mb-4">
              <p className="text-sm font-medium text-blue-800 mb-2">Color</p>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedColor('All')}
                  className={`text-xs px-3 py-1 rounded-full border ${selectedColor === 'All' ? 'bg-purple-400 text-black border-blue-600' : 'text-pink-600 border-blue-300'
                    }`}
                >
                  All
                </button>
                {colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`text-xs px-3 py-1 rounded-full border ${selectedColor === color ? 'bg-purple-400 text-black border-blue-600' : 'text-pink-600 border-blue-300'
                      }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
            {/* sort  */}
            <div className="mb-4">
              <p className="text-sm font-medium text-gray-600 mb-2">Sort By</p>
              <div className="flex flex-col gap-1">
                {[
                  { value: 'priceLow', label: 'Price: Low to High' },
                  { value: 'priceHigh', label: 'Price: High to Low' },
                  { value: 'nameAZ', label: 'Name: A to Z' },
                  { value: 'nameZA', label: 'Name: Z to A' },
                ].map((opt) => (
                  <label key={opt.value} className="flex items-center gap-2 text-sm text-gray-700">
                    <input
                      type="radio"
                      name="sort"
                      checked={sortBy === opt.value}
                      onChange={() => setSortBy(opt.value)}
                    />
                    {opt.label}
                  </label>
                ))}
              </div>
            </div>
                {/* filterbtn  */}
            <div className="flex gap-2">
              <button onClick={resetFilters} className="flex-1 border border-gray-300 bg-pink-400 text-white rounded-full py-2 text-sm font-medium">
                Reset
              </button>
              <button onClick={() => setFilterOpen(false)} className="flex-1  bg-purple-600 text-white rounded-full py-2 text-sm font-medium">
                Apply
              </button>
            </div>
          </div>
        )}
      </div>

      <hr />
        {/* ProductItem  */}
      {filteredItems.length > 0 ? (
        <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-4 mt-10">
          {filteredItems.map((item) => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-center py-10">No flowers found in this category.</p>
      )}
    </div>
  )
}

export default CategoryItems