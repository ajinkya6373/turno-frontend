import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { toast } from 'sonner'
import { setCredentials } from '../features/auth/authSlice'
import api from '../api/api'

export default function Login() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || '/'

  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await api.post('/auth/login', form)
      const { token, user } = res.data.data
      dispatch(setCredentials({ token, user }))
      toast.success(`Welcome back, ${user.name.split(' ')[0]}!`)
      navigate(from, { replace: true })
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  const inputClass =
    'w-full text-sm border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-indigo-400'

  return (
    <div className="max-w-sm mx-auto mt-12">
      <div className="text-center mb-7">
        <h1 className="text-2xl font-bold text-gray-900">Welcome back</h1>
        <p className="text-sm text-gray-500 mt-1">Log in to your Turno account</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs text-gray-500 block mb-1">Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              required
              autoFocus
              className={inputClass}
            />
          </div>

          <div>
            <label className="text-xs text-gray-500 block mb-1">Password</label>
            <input
              type="password"
              placeholder="••••••"
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              required
              className={inputClass}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-2.5 rounded-md text-sm font-medium hover:bg-indigo-700 disabled:opacity-60 transition-colors"
          >
            {loading ? 'Logging in...' : 'Log In'}
          </button>
        </form>

        <p className="text-xs text-center text-gray-500 mt-4">
          Don't have an account?{' '}
          <Link to="/signup" className="text-indigo-600 hover:underline">
            Sign up
          </Link>
        </p>

        {/* demo accounts hint */}
        <div className="mt-5 pt-4 border-t border-gray-100">
          <p className="text-xs text-gray-400 text-center mb-2">Demo accounts</p>
          <div className="space-y-1.5">
            <button
              type="button"
              onClick={() => setForm({ email: 'admin@turno.com', password: 'admin123' })}
              className="w-full text-xs text-left px-3 py-2 bg-gray-50 rounded-md hover:bg-gray-100 text-gray-600"
            >
              👑 admin@turno.com / admin123 <span className="text-gray-400">(Admin)</span>
            </button>
            <button
              type="button"
              onClick={() => setForm({ email: 'john@example.com', password: 'user123' })}
              className="w-full text-xs text-left px-3 py-2 bg-gray-50 rounded-md hover:bg-gray-100 text-gray-600"
            >
              👤 john@example.com / user123 <span className="text-gray-400">(User)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
