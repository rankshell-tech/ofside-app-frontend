import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Venue } from '@/types';
import { RootState } from '..';

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

    // Use this once in the first step to create the base object
    addNewVenue: (state, action: PayloadAction<Venue>) => {
      state.newVenue = action.payload;
    },

    // Use this in later steps to patch fields
    updateNewVenue: (state, action: PayloadAction<Partial<Venue>>) => {
      if (state.newVenue) {
        state.newVenue = { ...state.newVenue, ...action.payload };
      } else {
        // optional: if somehow called before addNewVenue
        state.newVenue = action.payload as Venue;
      }
    },

    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
});

export const { addNewVenue, updateNewVenue, setLoading } = newVenueSlice.actions;

export const getNewVenueCurrentData = (state: RootState): Venue | null =>
  state.newVenue.newVenue;

export default newVenueSlice.reducer;
