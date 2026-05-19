import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'
import { HiTrash } from 'react-icons/hi'
import { fetchBookmarks, removeBookmark } from '../features/bookmarks/bookmarkSlice'

const FUEL_BADGE = {
  Petrol: 'bg-orange-100 text-orange-700',
  Diesel: 'bg-blue-100 text-blue-700',
  Electric: 'bg-green-100 text-green-700',
}

export default function Wishlist() {
  const dispatch = useDispatch()
  const { bookmarks, loading } = useSelector(state => state.bookmarks)

  useEffect(() => {
    dispatch(fetchBookmarks())
  }, [])

  const handleRemove = async (id) => {
    try {
      await dispatch(removeBookmark(id)).unwrap()
      toast.success('Removed from wishlist')
    } catch (err) {
      toast.error(typeof err === 'string' ? err : 'Failed to remove')
    }
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">My Wishlist</h1>
        <p className="text-sm text-gray-500 mt-1">
          {bookmarks.length} saved vehicle{bookmarks.length !== 1 ? 's' : ''}
        </p>
      </div>

      {loading && (
        <div className="text-center py-20 text-gray-400">Loading...</div>
      )}

      {!loading && bookmarks.length === 0 && (
        <div className="text-center py-20">
          <p className="text-gray-400 mb-3">You haven't saved any vehicles yet.</p>
          <Link to="/" className="text-indigo-600 hover:underline text-sm">
            Browse the catalog
          </Link>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {bookmarks.map(b => {
          const v = b.vehicle
          if (!v) return null

          return (
            <div key={b.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <div className="h-40 bg-gray-100">
                <img
                  src={v.imageUrl || `https://placehold.co/400x200/e5e7eb/9ca3af?text=${v.brand}`}
                  alt={v.name}
                  className="w-full h-full object-cover"
                  onError={e => {
                    e.target.src = `https://placehold.co/400x200/e5e7eb/9ca3af?text=${v.brand}`
                  }}
                />
              </div>

              <div className="p-4">
                <p className="text-xs text-gray-400 uppercase tracking-wide">{v.brand}</p>
                <h3 className="font-semibold text-gray-900 mt-0.5">{v.name}</h3>

                <div className="mt-2 flex items-center justify-between">
                  <span className="text-indigo-600 font-bold text-sm">${v.price.toLocaleString()}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${FUEL_BADGE[v.fuelType]}`}>
                    {v.fuelType}
                  </span>
                </div>

                <div className="mt-3 flex gap-2">
                  <Link
                    to={`/vehicles/${v.id}`}
                    className="flex-1 text-center text-sm bg-gray-900 text-white py-1.5 rounded-md hover:bg-gray-700 transition-colors"
                  >
                    View
                  </Link>
                  <button
                    onClick={() => handleRemove(b.id)}
                    className="flex items-center gap-1 px-3 py-1.5 text-sm border border-red-200 text-red-500 rounded-md hover:bg-red-50 transition-colors"
                  >
                    <HiTrash size={14} />
                    Remove
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
