import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Venue, SportType } from '@/types';

interface VenueState {
  venues: Venue[];
  filteredVenues: Venue[];
  searchQuery: string;
  selectedSports: SportType[];
  isLoading: boolean;
}

const initialState: VenueState = {
  venues: [],
  filteredVenues: [],
  searchQuery: '',
  selectedSports: [],
  isLoading: false,
};

const venueSlice = createSlice({
  name: 'venues',
  initialState,
  reducers: {
    setVenues: (state, action: PayloadAction<Venue[]>) => {
      state.venues = action.payload;
      state.filteredVenues = action.payload;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
      state.filteredVenues = state.venues.filter(venue =>
        venue.name.toLowerCase().includes(action.payload.toLowerCase()) ||
        venue.address.toLowerCase().includes(action.payload.toLowerCase())
      );
    },
    toggleSportFilter: (state, action: PayloadAction<SportType>) => {
      const sport = action.payload;
      if (state.selectedSports.includes(sport)) {
        state.selectedSports = state.selectedSports.filter(s => s !== sport);
      } else {
        state.selectedSports.push(sport);
      }
      
      if (state.selectedSports.length === 0) {
        state.filteredVenues = state.venues;
      } else {
        state.filteredVenues = state.venues.filter(venue =>
          venue.facilities.some(facility =>
            state.selectedSports.includes(facility.sport)
          )
        );
      }
    },
    clearFilters: (state) => {
      state.selectedSports = [];
      state.searchQuery = '';
      state.filteredVenues = state.venues;
    },
  },
});

export const { setVenues, setSearchQuery, toggleSportFilter, clearFilters } = venueSlice.actions;
export default venueSlice.reducer;