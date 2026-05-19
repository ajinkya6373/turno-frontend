import { useState } from 'react'
import { toast } from 'sonner'
import api from '../api/api'

const BRANDS = ['Toyota', 'Honda', 'Tesla', 'Ford', 'Hyundai']
const FUEL_TYPES = ['Petrol', 'Diesel', 'Electric']

const empty = { brand: '', name: '', price: '', fuelType: '', description: '', imageUrl: '' }

export default function Admin() {
  const [form, setForm] = useState(empty)
  const [loading, setLoading] = useState(false)

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const payload = { ...form, price: parseFloat(form.price) }
      await api.post('/vehicles', payload)
      toast.success(`${form.name} added to the catalog`)
      setForm(empty)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add vehicle')
    } finally {
      setLoading(false)
    }
  }

  const inputClass =
    'w-full text-sm border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-indigo-400'

  return (
    <div className="max-w-lg mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Add New Vehicle</h1>
        <p className="text-sm text-gray-500 mt-1">Admin — add a vehicle to the catalog</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* brand + fuel type side by side */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-500 block mb-1">Brand *</label>
              <select
                value={form.brand}
                onChange={e => set('brand', e.target.value)}
                required
                className={inputClass}
              >
                <option value="">Select brand</option>
                {BRANDS.map(b => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>

            <div>
              <label className="text-xs text-gray-500 block mb-1">Fuel Type *</label>
              <select
                value={form.fuelType}
                onChange={e => set('fuelType', e.target.value)}
                required
                className={inputClass}
              >
                <option value="">Select type</option>
                {FUEL_TYPES.map(f => <option key={f} value={f}>{f}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs text-gray-500 block mb-1">Vehicle Name *</label>
            <input
              type="text"
              placeholder="e.g. Camry 2024"
              value={form.name}
              onChange={e => set('name', e.target.value)}
              required
              className={inputClass}
            />
          </div>

          <div>
            <label className="text-xs text-gray-500 block mb-1">Price (USD) *</label>
            <input
              type="number"
              placeholder="e.g. 25000"
              value={form.price}
              onChange={e => set('price', e.target.value)}
              required
              min="0"
              className={inputClass}
            />
          </div>

          <div>
            <label className="text-xs text-gray-500 block mb-1">Image URL</label>
            <input
              type="url"
              placeholder="https://..."
              value={form.imageUrl}
              onChange={e => set('imageUrl', e.target.value)}
              className={inputClass}
            />
          </div>

          <div>
            <label className="text-xs text-gray-500 block mb-1">Description</label>
            <textarea
              rows={3}
              placeholder="Short description of the vehicle..."
              value={form.description}
              onChange={e => set('description', e.target.value)}
              className={`${inputClass} resize-none`}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-2.5 rounded-md text-sm font-medium hover:bg-indigo-700 disabled:opacity-60 transition-colors"
          >
            {loading ? 'Adding...' : 'Add to Catalog'}
          </button>
        </form>
      </div>
    </div>
  )
}
