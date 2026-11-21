import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { aboutFetch } from "../features/AboutSlice"

function About() {

    // fetch 
    const dispatch = useDispatch()
    const { aboutData, status } = useSelector((state) => state.about)

    useEffect(() => {
        dispatch(aboutFetch())
    }, [dispatch])


    // loading 
    if (status === 'loading' || !aboutData) return null
    
    // stats 
    const stats = [1, 2, 3, 4].map((num) => ({
        icon: aboutData[`stat${num}Icon`]?.url ? `${import.meta.env.VITE_API_URL}${aboutData[`stat${num}Icon`].url}` : null,
        number: aboutData[`stat${num}number`],
        label: aboutData[`stat${num}label`],
    }))

    return (
        <>
            <section className="w-[90%] m-auto my-14 mt-35">
                <hr />
                {/* Story text */}
                <div className="max-w-4xl m-auto text-center  my-10">
                    <h2 className="text-5xl dan font-extrabold text-blue-900 mb-3">{aboutData.title}</h2>
                    <p className="text-purple-600 leading-relaxed">
                        {aboutData.description}
                    </p>
                </div>
                {/* Stats cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-10 ">
                    {stats.map((stat, i) => (
                        <div
                            key={i}
                            className="bg-blue-200 bg-linear-to-r from-[##53D0E0]  , to-[#0D5FB5] rounded-2xl p-6 text-center 
                            shadow-[0px_0px_5px] shadow-purple-900 flex items-center justify-evenly"
                        >
                            <div className="">
                                <i className="">
                                    {stat.icon && <img src={stat.icon} alt="" className="w-15 h-15 object-contain" />}
                                </i>
                            </div>
                            <div className="">
                                <p className="text-2xl font-bold text-purple-700">{stat.number}</p>
                                <p className="text-sm text-blue-200">{stat.label}</p>
                            </div>
                        </div>
                    ))}
                </div>

            </section>
        </>
    )
}

export default About