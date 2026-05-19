import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'sonner'
import { HiArrowLeft, HiHeart, HiOutlineHeart } from 'react-icons/hi'
import { addBookmark, removeBookmark, fetchBookmarks } from '../features/bookmarks/bookmarkSlice'
import BookingForm from '../components/BookingForm'
import api from '../api/api'

const FUEL_BADGE = {
  Petrol: 'bg-orange-100 text-orange-700',
  Diesel: 'bg-blue-100 text-blue-700',
  Electric: 'bg-green-100 text-green-700',
}

export default function VehicleDetail() {
  const { id } = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { token } = useSelector(state => state.auth)
  const { bookmarks } = useSelector(state => state.bookmarks)

  const [vehicle, setVehicle] = useState(null)
  const [loading, setLoading] = useState(true)
  const [bookmarking, setBookmarking] = useState(false)

  const existingBookmark = bookmarks.find(b => b.vehicleId === parseInt(id))

  useEffect(() => {
    api.get(`/vehicles/${id}`)
      .then(res => setVehicle(res.data.data))
      .catch(() => toast.error('Could not load vehicle'))
      .finally(() => setLoading(false))

    if (token) dispatch(fetchBookmarks())
  }, [id])

  const handleBookmark = async () => {
    if (!token) {
      toast.error('Please login to bookmark vehicles')
      navigate('/login')
      return
    }

    setBookmarking(true)
    try {
      if (existingBookmark) {
        await dispatch(removeBookmark(existingBookmark.id)).unwrap()
        toast.success('Removed from wishlist')
      } else {
        await dispatch(addBookmark(parseInt(id))).unwrap()
        toast.success('Added to wishlist')
      }
    } catch (err) {
      toast.error(typeof err === 'string' ? err : 'Something went wrong')
    } finally {
      setBookmarking(false)
    }
  }

  if (loading) {
    return <div className="text-center py-20 text-gray-400">Loading vehicle...</div>
  }

  if (!vehicle) {
    return <div className="text-center py-20 text-gray-400">Vehicle not found.</div>
  }

  return (
    <div className="max-w-3xl mx-auto">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 mb-5"
      >
        <HiArrowLeft size={16} />
        Back to catalog
      </button>

      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        {/* image */}
        <div className="h-72 bg-gray-100">
          <img
            src={vehicle.imageUrl || `https://placehold.co/800x400/e5e7eb/9ca3af?text=${vehicle.brand}`}
            alt={vehicle.name}
            className="w-full h-full object-cover"
            onError={e => {
              e.target.src = `https://placehold.co/800x400/e5e7eb/9ca3af?text=${vehicle.brand}`
            }}
          />
        </div>

        <div className="p-6">
          {/* title row */}
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wide">{vehicle.brand}</p>
              <h1 className="text-2xl font-bold text-gray-900 mt-0.5">{vehicle.name}</h1>
            </div>

            <button
              onClick={handleBookmark}
              disabled={bookmarking}
              className={`shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-md border text-sm font-medium transition-colors ${
                existingBookmark
                  ? 'bg-red-50 text-red-600 border-red-200 hover:bg-red-100'
                  : 'bg-white text-gray-600 border-gray-300 hover:border-gray-400'
              }`}
            >
              {existingBookmark
                ? <><HiHeart size={16} /> Saved</>
                : <><HiOutlineHeart size={16} /> Save</>
              }
            </button>
          </div>

          {/* price + fuel */}
          <div className="mt-4 flex items-center gap-3">
            <span className="text-3xl font-bold text-indigo-600">
              ${vehicle.price.toLocaleString()}
            </span>
            <span className={`text-sm px-2.5 py-0.5 rounded-full font-medium ${FUEL_BADGE[vehicle.fuelType]}`}>
              {vehicle.fuelType}
            </span>
          </div>

          {/* description */}
          {vehicle.description && (
            <p className="mt-4 text-sm text-gray-600 leading-relaxed">{vehicle.description}</p>
          )}

          {/* spec grid */}
          <div className="mt-5 grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[
              { label: 'Brand', value: vehicle.brand },
              { label: 'Fuel Type', value: vehicle.fuelType },
              { label: 'Listed Price', value: `$${vehicle.price.toLocaleString()}` },
            ].map(spec => (
              <div key={spec.label} className="bg-gray-50 rounded-md p-3">
                <span className="text-xs text-gray-400 block">{spec.label}</span>
                <span className="text-sm font-medium text-gray-800 mt-0.5 block">{spec.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* booking form */}
      <BookingForm vehicleId={parseInt(id)} />
    </div>
  )
}
