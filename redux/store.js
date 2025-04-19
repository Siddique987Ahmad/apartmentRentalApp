import {configureStore} from '@reduxjs/toolkit';
import authReducer from './auth/authSlice';
import apartmentReducer from './apartment/apartmentSlice'

const store = configureStore({
  reducer: {
    auth: authReducer,
    apartment:apartmentReducer,
  },
});
export default store;
