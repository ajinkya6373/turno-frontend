import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'
import api from '../api/api'

const STATUS_STYLE = {
  PENDING: 'bg-yellow-100 text-yellow-700',
  CONFIRMED: 'bg-green-100 text-green-700',
  CANCELLED: 'bg-red-100 text-red-700',
}

export default function MyBookings() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/bookings')
      .then(res => setBookings(res.data.data))
      .catch(() => toast.error('Failed to load bookings'))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">My Bookings</h1>
        <p className="text-sm text-gray-500 mt-1">
          {bookings.length} booking{bookings.length !== 1 ? 's' : ''}
        </p>
      </div>

      {loading && (
        <div className="text-center py-20 text-gray-400">Loading...</div>
      )}

      {!loading && bookings.length === 0 && (
        <div className="text-center py-20">
          <p className="text-gray-400 mb-3">No bookings yet.</p>
          <Link to="/" className="text-indigo-600 hover:underline text-sm">
            Browse vehicles to book one
          </Link>
        </div>
      )}

      <div className="space-y-3">
        {bookings.map(b => (
          <div
            key={b.id}
            className="bg-white border border-gray-200 rounded-lg p-4 flex gap-4 items-start"
          >
            {/* vehicle thumbnail */}
            <div className="h-16 w-24 rounded-md bg-gray-100 overflow-hidden shrink-0">
              <img
                src={b.vehicle?.imageUrl || `https://placehold.co/100x64/e5e7eb/9ca3af?text=Car`}
                alt={b.vehicle?.name}
                className="w-full h-full object-cover"
                onError={e => {
                  e.target.src = 'https://placehold.co/100x64/e5e7eb/9ca3af?text=Car'
                }}
              />
            </div>

            {/* details */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2 flex-wrap">
                <div>
                  <p className="text-xs text-gray-400">{b.vehicle?.brand}</p>
                  <p className="font-semibold text-gray-900">{b.vehicle?.name}</p>
                </div>
                <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${STATUS_STYLE[b.status]}`}>
                  {b.status}
                </span>
              </div>

              <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">
                <span>
                  📅{' '}
                  {new Date(b.bookingDate).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </span>
                <span>👤 {b.customerName}</span>
                <span>✉️ {b.customerEmail}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
