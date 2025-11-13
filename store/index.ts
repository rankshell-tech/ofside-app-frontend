import { configureStore } from '@reduxjs/toolkit';
import authSlice from './slices/authSlice';
import themeSlice from './slices/themeSlice';
import venueSlice from './slices/venueSlice';
import bookingSlice from './slices/bookingSlice';
import matchScoringSlice from './slices/matchScoringSlice';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    theme: themeSlice,
    venues: venueSlice,
    bookings: bookingSlice,
    matchScoring: matchScoringSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;