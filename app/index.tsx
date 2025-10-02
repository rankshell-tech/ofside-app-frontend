import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

export default function Index() {
  const router = useRouter();
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const isGuest = useSelector((state: RootState) => state.auth.isGuest);

  useEffect(() => {
    // Simulate app initialization
    const timer = setTimeout(() => {
      if (isAuthenticated || isGuest) {
        router.replace('/(tabs)');
      } else {
        router.replace('/login/loginViaApp');
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [isAuthenticated, isGuest, router]);

  return <LoadingSpinner fullScreen />;
}