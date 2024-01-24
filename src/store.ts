import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/auth/authSlice';
import restaurantReducer from './features/restaurant/restaurantSlice';


const store = configureStore({
  reducer: {
    auth: authReducer,
    restaurant: restaurantReducer
  }
})

export type AppDispatch = typeof store.dispatch;
export default store;