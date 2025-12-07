import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

export default function Index() {
  const router = useRouter();
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const isGuest = useSelector((state: RootState) => state.auth.isGuest);
  const user = useSelector((state: RootState) => state.auth.user);
  const isProfileSwitchedToVenuePartner = user?.isProfileSwitchedToVenuePartner;

  useEffect(() => {
    // Simulate app initialization
    const timer = setTimeout(() => {
      if (isAuthenticated || isGuest) {
        // Check if user has switched to venue partner mode
        if (user && isProfileSwitchedToVenuePartner === true) {
          router.replace('/(venuePartnerTabs)');
        } else {
          router.replace('/(tabs)');
        }
      } else {
        router.replace('/login');
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [isAuthenticated, isGuest, router, user, isProfileSwitchedToVenuePartner]);

  return <LoadingSpinner fullScreen />;
}