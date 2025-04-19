import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import shipmentsReducer from './slices/shipmentSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    shipments: shipmentsReducer

  },
});

export default store;