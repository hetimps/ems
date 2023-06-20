import { configureStore } from '@reduxjs/toolkit'
import Login_slice from './Login_slice'

export const store = configureStore({
  reducer: {
    login_user: Login_slice
  },
})