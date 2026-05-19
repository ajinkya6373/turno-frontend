import { Link } from 'react-router-dom'

const FUEL_BADGE = {
  Petrol: 'bg-orange-100 text-orange-700',
  Diesel: 'bg-blue-100 text-blue-700',
  Electric: 'bg-green-100 text-green-700',
}

export default function VehicleCard({ vehicle }) {
  const { id, brand, name, price, fuelType, imageUrl } = vehicle

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow duration-200">
      <div className="h-44 bg-gray-100 overflow-hidden">
        <img
          src={imageUrl || `https://placehold.co/400x200/e5e7eb/9ca3af?text=${brand}`}
          alt={name}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = `https://placehold.co/400x200/e5e7eb/9ca3af?text=${brand}`
          }}
        />
      </div>

      <div className="p-4">
        <p className="text-xs text-gray-400 uppercase tracking-wide">{brand}</p>
        <h3 className="font-semibold text-gray-900 mt-0.5 text-base leading-snug">{name}</h3>

        <div className="mt-3 flex items-center justify-between">
          <span className="text-indigo-600 font-bold">${price.toLocaleString()}</span>
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${FUEL_BADGE[fuelType]}`}>
            {fuelType}
          </span>
        </div>

        <Link
          to={`/vehicles/${id}`}
          className="mt-3 block w-full text-center text-sm bg-gray-900 text-white py-2 rounded-md hover:bg-gray-700 transition-colors"
        >
          View Details
        </Link>
      </div>
    </div>
  )
}
