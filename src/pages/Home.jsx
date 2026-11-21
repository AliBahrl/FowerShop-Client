import About from '../components/About'
import CategoriesCard from '../components/CategoriesCard'
import Feedback from '../components/FeedBack'
import Hero from '../components/Hero'
import ItemsSections from '../components/ItemsSections'

function Home() {
  return (
    <>
      <Hero/>
      <CategoriesCard/>
      <ItemsSections/>
      <About/>
      <Feedback/>
    </>
  )
}

export default Home