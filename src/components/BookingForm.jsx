import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { toast } from 'sonner'
import api from '../api/api'

export default function BookingForm({ vehicleId }) {
  const navigate = useNavigate()
  const { user, token } = useSelector(state => state.auth)

  const [form, setForm] = useState({
    customerName: user?.name || '',
    customerEmail: user?.email || '',
    bookingDate: '',
  })
  const [loading, setLoading] = useState(false)

  const today = new Date().toISOString().split('T')[0]

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!token) {
      toast.error('Please login to book a vehicle')
      navigate('/login')
      return
    }

    setLoading(true)
    try {
      await api.post('/bookings', { ...form, vehicleId })
      toast.success('Booking confirmed! Redirecting to your bookings...')
      setTimeout(() => navigate('/bookings'), 1200)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Booking failed')
    } finally {
      setLoading(false)
    }
  }

  const inputClass =
    'w-full text-sm border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-indigo-400'

  return (
    <div className="mt-6 bg-white border border-gray-200 rounded-lg p-5">
      <h2 className="text-base font-semibold text-gray-800 mb-4">Book This Vehicle</h2>

      {!token && (
        <p className="text-sm text-gray-500 mb-3">
          <button
            onClick={() => navigate('/login')}
            className="text-indigo-600 hover:underline"
          >
            Log in
          </button>{' '}
          to complete a booking.
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="text-xs text-gray-500 block mb-1">Your Name</label>
          <input
            type="text"
            value={form.customerName}
            onChange={e => setForm({ ...form, customerName: e.target.value })}
            required
            className={inputClass}
          />
        </div>

        <div>
          <label className="text-xs text-gray-500 block mb-1">Email</label>
          <input
            type="email"
            value={form.customerEmail}
            onChange={e => setForm({ ...form, customerEmail: e.target.value })}
            required
            className={inputClass}
          />
        </div>

        <div>
          <label className="text-xs text-gray-500 block mb-1">Preferred Date</label>
          <input
            type="date"
            value={form.bookingDate}
            onChange={e => setForm({ ...form, bookingDate: e.target.value })}
            required
            min={today}
            className={inputClass}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 text-white py-2.5 rounded-md text-sm font-medium hover:bg-indigo-700 disabled:opacity-60 transition-colors"
        >
          {loading ? 'Booking...' : 'Confirm Booking'}
        </button>
      </form>
    </div>
  )
}
