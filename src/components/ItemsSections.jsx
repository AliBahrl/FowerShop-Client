import { useSelector } from 'react-redux'
import CategoryRow from './ItemsRow'

function ItemsSections() {

  // productfetch
  const {productData , status} = useSelector((state)=> state.product)

// categoryunique
  const uniqueCategories = [...new Set(productData.map((item) => item.category?.name))]

  // loading
   if (status === 'loading') {
    return (
      <section className='h-[75vh] flex items-center justify-center bg-gray-500'>
        <p className='text-4xl text-blue-700'>Loading.....</p>
      </section>
    )
  }

  return (
    <div>
      <CategoryRow
        title="Top Sell"
        items={productData.filter((item) => item.topSell).slice(0, 6)}
        link='/flowers'
      />

      {uniqueCategories.map((cat) => {
         const categorySlug = productData.find((item) => item.category?.name === cat)?.category?.slug
         return(
           <CategoryRow
             key={cat}
             title={cat}
             items={productData.filter((item) => item.category?.name === cat).slice(0, 6)}
             link={`/category/${categorySlug}`}
           />

         )
      }
      )}
    </div>
  )
}

export default ItemsSections