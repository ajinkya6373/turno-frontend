import { useDispatch, useSelector } from 'react-redux'
import { setFilters, resetFilters, fetchVehicles } from '../features/catalog/catalogSlice'

const BRANDS = ['Toyota', 'Honda', 'Tesla', 'Ford', 'Hyundai']
const FUEL_TYPES = ['Petrol', 'Diesel', 'Electric']

export default function FilterBar() {
  const dispatch = useDispatch()
  const filters = useSelector(state => state.catalog.filters)

  const handleChange = (key, value) => {
    const updated = { ...filters, [key]: value }
    dispatch(setFilters({ [key]: value }))
    dispatch(fetchVehicles(updated))
  }

  const handleReset = () => {
    dispatch(resetFilters())
    dispatch(fetchVehicles({}))
  }

  const inputClass =
    'text-sm border border-gray-300 rounded-md px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-400 bg-white'

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6 flex flex-wrap gap-4 items-end">
      <div>
        <label className="block text-xs text-gray-500 mb-1">Brand</label>
        <select
          value={filters.brand}
          onChange={e => handleChange('brand', e.target.value)}
          className={inputClass}
        >
          <option value="">All Brands</option>
          {BRANDS.map(b => <option key={b} value={b}>{b}</option>)}
        </select>
      </div>

      <div>
        <label className="block text-xs text-gray-500 mb-1">Fuel Type</label>
        <select
          value={filters.fuelType}
          onChange={e => handleChange('fuelType', e.target.value)}
          className={inputClass}
        >
          <option value="">All Types</option>
          {FUEL_TYPES.map(f => <option key={f} value={f}>{f}</option>)}
        </select>
      </div>

      <div>
        <label className="block text-xs text-gray-500 mb-1">Min Price ($)</label>
        <input
          type="number"
          placeholder="0"
          value={filters.minPrice}
          onChange={e => handleChange('minPrice', e.target.value)}
          className={`${inputClass} w-28`}
          min="0"
        />
      </div>

      <div>
        <label className="block text-xs text-gray-500 mb-1">Max Price ($)</label>
        <input
          type="number"
          placeholder="Any"
          value={filters.maxPrice}
          onChange={e => handleChange('maxPrice', e.target.value)}
          className={`${inputClass} w-28`}
          min="0"
        />
      </div>

      {(filters.brand || filters.fuelType || filters.minPrice || filters.maxPrice) && (
        <button
          onClick={handleReset}
          className="text-sm text-gray-500 hover:text-gray-800 underline self-end pb-1.5"
        >
          Clear filters
        </button>
      )}
    </div>
  )
}
