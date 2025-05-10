import { configureStore } from '@reduxjs/toolkit'
import authSignup_reducer from './slices/authSignup'
import authLogin_reducer from  './slices/authLogin'
export const store = configureStore({
  reducer: {
    signup: authSignup_reducer,
    login: authLogin_reducer
  }
})