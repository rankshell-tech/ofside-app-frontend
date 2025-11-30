import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';
import { addNewVenue, updateNewVenue, setLoading } from '@/store/slices/newVenueSlice';
import { Venue } from '@/types';

export const useNewVenue = () => {
  const dispatch = useDispatch();
  const { newVenue, isLoading } = useSelector((state: RootState) => state.newVenue);

  return {
    newVenue,
    isLoading,
    addNewVenue: (venue: Venue) => dispatch(addNewVenue(venue)),
    updateNewVenue: (venue: Venue) => dispatch(updateNewVenue(venue)),
    setLoading: (loading: boolean) => dispatch(setLoading(loading)),
  };
};