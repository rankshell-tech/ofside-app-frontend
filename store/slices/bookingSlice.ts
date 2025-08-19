import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Booking } from '@/types';

interface BookingState {
  bookings: Booking[];
  isLoading: boolean;
}

const initialState: BookingState = {
  bookings: [],
  isLoading: false,
};

const bookingSlice = createSlice({
  name: 'bookings',
  initialState,
  reducers: {
    setBookings: (state, action: PayloadAction<Booking[]>) => {
      state.bookings = action.payload;
    },
    addBooking: (state, action: PayloadAction<Booking>) => {
      state.bookings.push(action.payload);
    },
    cancelBooking: (state, action: PayloadAction<string>) => {
      const booking = state.bookings.find(b => b.id === action.payload);
      if (booking) {
        booking.status = 'cancelled';
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
});

export const { setBookings, addBooking, cancelBooking, setLoading } = bookingSlice.actions;
export default bookingSlice.reducer;