import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { HiMenu, HiX } from 'react-icons/hi'
import { logout } from '../features/auth/authSlice'
import { toast } from 'sonner'

export default function Navbar() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const { user } = useSelector(state => state.auth)
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = () => {
    dispatch(logout())
    toast.success('Logged out')
    navigate('/login')
    setMenuOpen(false)
  }

  const isActive = (path) => location.pathname === path

  const linkClass = (path) =>
    `text-sm font-medium transition-colors ${
      isActive(path) ? 'text-indigo-600' : 'text-gray-600 hover:text-gray-900'
    }`

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-20">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        {/* logo */}
        <Link to="/" className="font-bold text-lg text-indigo-600 tracking-tight">
          Turno
        </Link>

        {/* desktop links */}
        <div className="hidden md:flex items-center gap-6">
          <Link to="/" className={linkClass('/')}>Catalog</Link>
          <Link to="/dashboard" className={linkClass('/dashboard')}>Dashboard</Link>

          {user && (
            <>
              <Link to="/wishlist" className={linkClass('/wishlist')}>Wishlist</Link>
              <Link to="/bookings" className={linkClass('/bookings')}>My Bookings</Link>
              {user.role === 'ADMIN' && (
                <Link to="/admin" className={linkClass('/admin')}>Admin</Link>
              )}
            </>
          )}
        </div>

        {/* desktop auth */}
        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <>
              <span className="text-sm text-gray-500">
                Hi, <span className="font-medium text-gray-700">{user.name.split(' ')[0]}</span>
              </span>
              <button
                onClick={handleLogout}
                className="text-sm text-red-500 hover:text-red-700 font-medium"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm text-gray-600 hover:text-gray-900 font-medium">
                Login
              </Link>
              <Link
                to="/signup"
                className="text-sm bg-indigo-600 text-white px-4 py-1.5 rounded-md hover:bg-indigo-700 font-medium"
              >
                Sign up
              </Link>
            </>
          )}
        </div>

        {/* mobile hamburger */}
        <button
          className="md:hidden text-gray-600"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <HiX size={22} /> : <HiMenu size={22} />}
        </button>
      </div>

      {/* mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-3 space-y-3">
          <Link to="/" className="block text-sm text-gray-700" onClick={() => setMenuOpen(false)}>Catalog</Link>
          <Link to="/dashboard" className="block text-sm text-gray-700" onClick={() => setMenuOpen(false)}>Dashboard</Link>

          {user && (
            <>
              <Link to="/wishlist" className="block text-sm text-gray-700" onClick={() => setMenuOpen(false)}>Wishlist</Link>
              <Link to="/bookings" className="block text-sm text-gray-700" onClick={() => setMenuOpen(false)}>My Bookings</Link>
              {user.role === 'ADMIN' && (
                <Link to="/admin" className="block text-sm text-gray-700" onClick={() => setMenuOpen(false)}>Admin</Link>
              )}
              <button onClick={handleLogout} className="block text-sm text-red-500">Logout</button>
            </>
          )}

          {!user && (
            <div className="flex gap-3 pt-1">
              <Link to="/login" className="text-sm text-gray-700" onClick={() => setMenuOpen(false)}>Login</Link>
              <Link to="/signup" className="text-sm text-indigo-600 font-medium" onClick={() => setMenuOpen(false)}>Sign up</Link>
            </div>
          )}
        </div>
      )}
    </nav>
  )
}
