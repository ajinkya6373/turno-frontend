import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../api/api'

export const fetchVehicles = createAsyncThunk(
  'catalog/fetchVehicles',
  async (filters = {}, { rejectWithValue }) => {
    try {
      const params = {}
      if (filters.brand) params.brand = filters.brand
      if (filters.fuelType) params.fuelType = filters.fuelType
      if (filters.minPrice) params.minPrice = filters.minPrice
      if (filters.maxPrice) params.maxPrice = filters.maxPrice

      const res = await api.get('/vehicles', { params })
      return res.data.data
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch vehicles')
    }
  }
)

const catalogSlice = createSlice({
  name: 'catalog',
  initialState: {
    vehicles: [],
    loading: false,
    error: null,
    filters: {
      brand: '',
      fuelType: '',
      minPrice: '',
      maxPrice: '',
    },
  },
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload }
    },
    resetFilters: (state) => {
      state.filters = { brand: '', fuelType: '', minPrice: '', maxPrice: '' }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchVehicles.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchVehicles.fulfilled, (state, action) => {
        state.loading = false
        state.vehicles = action.payload
      })
      .addCase(fetchVehicles.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  },
})

export const { setFilters, resetFilters } = catalogSlice.actions
export default catalogSlice.reducer
