import { Tabs } from 'expo-router';
import { Chrome as Home, Calendar, User, Building, Heart } from 'lucide-react-native';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { useTheme } from '@/hooks/useTheme';

export default function TabLayout() {
  const user = useSelector((state: RootState) => state.auth.user);
  const isGuest = useSelector((state: RootState) => state.auth.isGuest);
  const theme = useTheme();
  
  const isVenueOwner = user?.role === 'venue_owner';
  const isAdmin = user?.role === 'admin';
  
  console.log('Current user role:', user?.role, 'isVenueOwner:', isVenueOwner, 'isAdmin:', isAdmin);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: theme.colors.background,
          borderTopColor: theme.colors.border,
          paddingBottom: 8,
          height: 65,
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textSecondary,
        tabBarLabelStyle: {
          fontSize: 12,
          fontFamily: 'Inter-Medium',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ size, color }) => (
            <Home size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="community"
        options={{
          title: 'Community',
          tabBarIcon: ({ size, color }) => (
            <Heart size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="bookings"
        options={{
          title: isGuest ? 'Sign In' : isAdmin ? 'Admin Panel' : isVenueOwner ? 'Dashboard' : 'Bookings',
          tabBarIcon: ({ size, color }) => (
            isAdmin ? <Building size={size} color={color} /> : isVenueOwner ? <Building size={size} color={color} /> : <Calendar size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ size, color }) => (
            <User size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}