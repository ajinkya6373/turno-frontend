import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchVehicles } from '../features/catalog/catalogSlice'
import VehicleCard from '../components/VehicleCard'
import FilterBar from '../components/FilterBar'

export default function Home() {
  const dispatch = useDispatch()
  const { vehicles, loading, error, filters } = useSelector(state => state.catalog)

  useEffect(() => {
    dispatch(fetchVehicles(filters))
  }, [])

  return (
    <div>
      <div className="mb-5">
        <h1 className="text-2xl font-bold text-gray-900">Vehicle Catalog</h1>
        <p className="text-sm text-gray-500 mt-1">
          Browse {vehicles.length > 0 ? `${vehicles.length} vehicles` : 'vehicles'} across multiple brands
        </p>
      </div>

      <FilterBar />

      {loading && (
        <div className="flex items-center justify-center py-20 text-gray-400">
          <span>Loading vehicles...</span>
        </div>
      )}

      {!loading && error && (
        <div className="text-center py-20 text-red-500">{error}</div>
      )}

      {!loading && !error && vehicles.length === 0 && (
        <div className="text-center py-20">
          <p className="text-gray-400 text-sm">No vehicles match the selected filters.</p>
        </div>
      )}

      {!loading && !error && vehicles.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {vehicles.map(v => (
            <VehicleCard key={v.id} vehicle={v} />
          ))}
        </div>
      )}
    </div>
  )
}
