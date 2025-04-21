import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import shipmentsReducer from './slices/shipmentSlice';
import routesReducer from './slices/routesSlice';
import carriersReducer from './slices/carriersSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    shipments: shipmentsReducer,
    routes: routesReducer,
    carriers: carriersReducer,

  },
});

export default store;