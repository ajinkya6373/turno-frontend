import { createSlice } from '@reduxjs/toolkit'

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: JSON.parse(localStorage.getItem('turno_user')) || null,
    token: localStorage.getItem('turno_token') || null,
  },
  reducers: {
    setCredentials: (state, action) => {
      const { token, user } = action.payload
      state.token = token
      state.user = user
      localStorage.setItem('turno_token', token)
      localStorage.setItem('turno_user', JSON.stringify(user))
    },
    logout: (state) => {
      state.token = null
      state.user = null
      localStorage.removeItem('turno_token')
      localStorage.removeItem('turno_user')
    },
  },
})

export const { setCredentials, logout } = authSlice.actions
export default authSlice.reducer
