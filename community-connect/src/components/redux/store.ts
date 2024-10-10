import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
// Import additional slices as your app grows
// import bookingReducer from './slices/bookingSlice';
// import chatReducer from './slices/chatSlice';

// Configure the store with the reducers
export const store = configureStore({
  reducer: {
    auth: authReducer,
    // Uncomment the slices you need
    // booking: bookingReducer,
    // chat: chatReducer,
  },
  // Middleware and dev tools are automatically included, but you can extend them if needed
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
