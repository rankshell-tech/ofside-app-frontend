import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Venue } from '@/types';


interface NewVenueState {
  newVenue: Venue | null;
  isLoading: boolean;
}

const initialState: NewVenueState = {
  newVenue: null,
  isLoading: false,
};

const newVenueSlice = createSlice({
  name: 'newVenue',
  initialState,
  reducers: {

    addNewVenue: (state, action: PayloadAction<Venue>) => {
      state.newVenue = action.payload;
    },

    updateNewVenue: (state, action: PayloadAction<Venue>) => {
      if (state.newVenue) {
        Object.assign(state.newVenue, action.payload);
      }
    },

    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
});

export const { addNewVenue, updateNewVenue, setLoading } = newVenueSlice.actions;
export default newVenueSlice.reducer;