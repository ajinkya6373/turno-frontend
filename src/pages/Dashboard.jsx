import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import api from '../api/api'

const BRAND_CARD = {
  Toyota: 'border-red-200 bg-red-50',
  Honda: 'border-blue-200 bg-blue-50',
  Tesla: 'border-gray-300 bg-gray-50',
  Ford: 'border-indigo-200 bg-indigo-50',
  Hyundai: 'border-green-200 bg-green-50',
}

const FUEL_BAR_COLOR = {
  Petrol: '#ea580c',
  Diesel: '#2563eb',
  Electric: '#16a34a',
}

const FUEL_TEXT = {
  Petrol: 'text-orange-600',
  Diesel: 'text-blue-600',
  Electric: 'text-green-600',
}

export default function Dashboard() {
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/vehicles/summary')
      .then(res => setSummary(res.data.data))
      .catch(() => toast.error('Failed to load summary'))
      .finally(() => setLoading(false))
  }, [])

  const total = summary?.byBrand?.reduce((sum, b) => sum + b.count, 0) || 0

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Inventory Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">Vehicle counts by brand and fuel type</p>
      </div>

      {loading && (
        <div className="text-center py-20 text-gray-400">Loading stats...</div>
      )}

      {summary && (
        <div className="space-y-6">
          {/* total */}
          <div className="bg-indigo-600 text-white rounded-lg p-5 flex items-center justify-between">
            <div>
              <p className="text-indigo-200 text-sm">Total Vehicles in Catalog</p>
              <p className="text-5xl font-bold mt-1">{total}</p>
            </div>
            <span className="text-6xl opacity-20">🚗</span>
          </div>

          {/* by brand */}
          <div>
            <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
              Vehicles by Brand
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {summary.byBrand.map(b => (
                <div
                  key={b.brand}
                  className={`border rounded-lg p-4 ${BRAND_CARD[b.brand] || 'border-gray-200 bg-white'}`}
                >
                  <p className="text-xs text-gray-500 font-medium">{b.brand}</p>
                  <p className="text-3xl font-bold text-gray-800 mt-1">{b.count}</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {b.count === 1 ? 'vehicle' : 'vehicles'}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* by fuel */}
          <div>
            <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
              Vehicles by Fuel Type
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {summary.byFuelType.map(f => {
                const pct = total > 0 ? Math.round((f.count / total) * 100) : 0
                return (
                  <div key={f.fuelType} className="bg-white border border-gray-200 rounded-lg p-4">
                    <p className={`text-sm font-semibold ${FUEL_TEXT[f.fuelType]}`}>
                      {f.fuelType}
                    </p>
                    <p className="text-3xl font-bold text-gray-800 mt-1">{f.count}</p>
                    <p className="text-xs text-gray-400 mb-3">{pct}% of total</p>

                    {/* mini progress bar */}
                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${pct}%`,
                          backgroundColor: FUEL_BAR_COLOR[f.fuelType] || '#6366f1',
                        }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
