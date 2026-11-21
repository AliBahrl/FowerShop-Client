import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Pagination } from 'swiper/modules'
import { FaStar } from 'react-icons/fa'


import 'swiper/css'
import 'swiper/css/pagination'
import { createFeedback, fetchPublishedFeedback } from '../features/feadbackSlice'

function Feedback() {
  const dispatch = useDispatch()
  const { publishedFeedback } = useSelector((state) => state.feedback)
  const { user, token } = useSelector((state) => state.auth)

  const [message, setMessage] = useState('')
  const [rating, setRating] = useState(5)
  const [submitting, setSubmitting] = useState(false)
  const [sent, setSent] = useState(false)

  useEffect(() => {
    dispatch(fetchPublishedFeedback())
  }, [dispatch])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!message.trim()) return

    setSubmitting(true)
    try {
      await dispatch(createFeedback({ name: user.username, message, rating })).unwrap()
      setMessage('')
      setRating(5)
      setSent(true)
    } catch (err) {
      alert(err)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="w-[90%] m-auto my-25">
      <h2 className="text-4xl dan font-extrabold text-blue-900 mb-6 text-center">
        What Our Customers Say
      </h2>

      {/* swiper feedback  */}
      {publishedFeedback.length > 0 && (
        <Swiper
          modules={[Autoplay, Pagination]}
          slidesPerView={1}
          breakpoints={{
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
          spaceBetween={20}
          autoplay={{ delay: 3500, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          className="pb-10"
        >
          {publishedFeedback.map((review) => (
            <SwiperSlide key={review.documentId}>
              <div className="bg-pink-50 rounded-2xl p-6 h-full shadow-sm">
                <p className="text-gray-700 leading-relaxed mb-4">"{review.message}"</p>
                <div className='flex items-center justify-between'>
                  <p className="font-semibold text-pink-700">{review.name}</p>
                  <div className="flex gap-1 text-yellow-400 mb-3">
                    {Array.from({ length: review.rating }).map((_, idx) => (
                      <FaStar key={idx} />
                    ))}
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      )}

      {/* add feedback */}
      {token && (
        <div className="max-w-2xl mx-auto mt-10 bg-blue-100 rounded-2xl border border-blue-200 p-6">
          <h3 className="text-xl font-bold text-blue-900 mb-4">Add Your Feedback</h3>

          {sent ? (
            <p className="text-pink-600 text-sm">
              Thanks! Your feedback was submitted and is waiting for approval.
            </p>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Share your experience..."
                className="w-full border border-pink-300 rounded-lg px-3 py-2 focus:border-pink-500"
                rows={3}
                required
              />

              <div className="flex items-center gap-2">
                <span className="text-sm text-purple-600">Rating:</span>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <FaStar
                      key={n}
                      onClick={() => setRating(n)}
                      className={`cursor-pointer ${n <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
                    />
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="px-4 py-2 rounded-lg bg-pink-600 text-white hover:bg-pink-700 disabled:opacity-50 self-start"
              >
                {submitting ? 'Submitting...' : 'Submit Feedback'}
              </button>
            </form>
          )}
        </div>
      )}
    </section>
  )
}

export default Feedback