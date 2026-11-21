import { Outlet } from "react-router-dom"
import NavBar from "../global/NavBar"
import Footer from "../global/Footer"

function MainLayout() {
  return (
    <>
        <NavBar/>
        <Outlet/>
        <Footer/>
    </>
  )
}

export default MainLayout