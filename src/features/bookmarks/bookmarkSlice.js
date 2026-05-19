import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../api/api'

export const fetchBookmarks = createAsyncThunk(
  'bookmarks/fetchBookmarks',
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get('/bookmarks')
      return res.data.data
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch bookmarks')
    }
  }
)

export const addBookmark = createAsyncThunk(
  'bookmarks/addBookmark',
  async (vehicleId, { rejectWithValue }) => {
    try {
      const res = await api.post('/bookmarks', { vehicleId })
      return res.data.data
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to bookmark')
    }
  }
)

export const removeBookmark = createAsyncThunk(
  'bookmarks/removeBookmark',
  async (bookmarkId, { rejectWithValue }) => {
    try {
      await api.delete(`/bookmarks/${bookmarkId}`)
      return bookmarkId
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to remove bookmark')
    }
  }
)

const bookmarkSlice = createSlice({
  name: 'bookmarks',
  initialState: {
    bookmarks: [],
    loading: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBookmarks.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchBookmarks.fulfilled, (state, action) => {
        state.loading = false
        state.bookmarks = action.payload
      })
      .addCase(fetchBookmarks.rejected, (state) => {
        state.loading = false
      })
      .addCase(addBookmark.fulfilled, (state, action) => {
        state.bookmarks.unshift(action.payload)
      })
      .addCase(removeBookmark.fulfilled, (state, action) => {
        state.bookmarks = state.bookmarks.filter(b => b.id !== action.payload)
      })
  },
})

export default bookmarkSlice.reducer
