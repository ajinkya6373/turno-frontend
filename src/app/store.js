import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../features/auth/authSlice'
import catalogReducer from '../features/catalog/catalogSlice'
import bookmarkReducer from '../features/bookmarks/bookmarkSlice'

const store = configureStore({
  reducer: {
    auth: authReducer,
    catalog: catalogReducer,
    bookmarks: bookmarkReducer,
  },
})

export default store
