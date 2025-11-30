import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';
import { addNewVenue, updateNewVenue, setLoading, getNewVenueCurrentData } from '@/store/slices/newVenueSlice';
import { Venue } from '@/types';

export const useNewVenue = () => {
  const dispatch = useDispatch();
  const currentNewVenue = useSelector(getNewVenueCurrentData);
  
  const isLoading = useSelector((state: RootState) => state.newVenue.isLoading);
  
  const updateVenuePartial = (updates: Partial<Venue>) => {
    if (currentNewVenue) {
      // Handle nested object merging for location, contact, owner, and rawVenueData
      const mergedUpdates: Partial<Venue> = { ...updates };
      
      // Merge location object if it exists
      if (updates.location && currentNewVenue.location) {
        mergedUpdates.location = { ...currentNewVenue.location, ...updates.location };
      }
      
      // Merge contact object if it exists
      if (updates.contact && currentNewVenue.contact) {
        mergedUpdates.contact = { ...currentNewVenue.contact, ...updates.contact };
      }
      
      // Merge owner object if it exists
      if (updates.owner && currentNewVenue.owner) {
        mergedUpdates.owner = { ...currentNewVenue.owner, ...updates.owner };
      } else if (updates.owner) {
        mergedUpdates.owner = updates.owner;
      }
      
      // Merge rawVenueData object if it exists
      if (updates.rawVenueData && currentNewVenue.rawVenueData) {
        mergedUpdates.rawVenueData = { ...currentNewVenue.rawVenueData, ...updates.rawVenueData };
      } else if (updates.rawVenueData) {
        mergedUpdates.rawVenueData = updates.rawVenueData;
      }
      
      dispatch(updateNewVenue({ ...currentNewVenue, ...mergedUpdates }));
    } else {
      // If no venue exists yet, just dispatch the updates
      dispatch(updateNewVenue(updates));
    }
  };
  
  return {
    currentNewVenue,
    updateVenuePartial,
    isLoading,
    addNewVenue: (venue: Venue) => dispatch(addNewVenue(venue)),
    updateNewVenue: (venue: Partial<Venue>) => dispatch(updateNewVenue(venue)),
    setLoading: (loading: boolean) => dispatch(setLoading(loading)),
  };
};