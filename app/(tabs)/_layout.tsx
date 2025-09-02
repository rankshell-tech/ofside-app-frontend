import { Tabs } from 'expo-router';
import { Chrome as Home, Calendar, User, Building, Heart } from 'lucide-react-native';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { useTheme } from '@/hooks/useTheme';
import { Platform } from 'react-native';
import { AntDesign, Foundation, Ionicons, MaterialIcons } from '@expo/vector-icons';

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
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.accent,
        tabBarLabelStyle: {
          fontSize: 14,
          fontFamily: 'Inter-Medium',
        },
        tabBarIconStyle: { marginBottom: -4 },
        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            position: 'absolute',
          },
          default: {},
        }),
      }}
    >
      <Tabs.Screen
        name="community"
        options={{
          title: 'Community',
          tabBarIcon: ({ size, color }) => (
            <Ionicons name="people" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ size, color }) => (
            <Foundation name="home" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="nearYou"
        options={{
          title: 'Near you',
          tabBarIcon: ({ size, color }) => (
            <MaterialIcons name="near-me" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'xplore',
          tabBarIcon: ({ size, color }) => (
            <AntDesign name="appstore1" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}