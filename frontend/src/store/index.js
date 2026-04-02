import { configureStore } from '@reduxjs/toolkit';
import cartSlice from '../features/cartSlice';
import authSlice from '../features/authSlice';

const store = configureStore({
  reducer: {
    cart: cartSlice.reducer,
    auth: authSlice.reducer,
  },
});

export default store;
