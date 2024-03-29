import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/auth/authSlice';
import spaceReducer from './features/space/spaceSlice';


const store = configureStore({
  reducer: {
    auth: authReducer,
    space: spaceReducer
  }
})

export type AppDispatch = typeof store.dispatch;
export default store;