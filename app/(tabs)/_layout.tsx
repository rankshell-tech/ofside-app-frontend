import { Tabs, useRouter, usePathname } from 'expo-router';
import { useEffect } from 'react';
import { BackHandler, Platform } from 'react-native';
import { Ionicons, Foundation, MaterialIcons, AntDesign } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { useTheme } from '@/hooks/useTheme';

export default function TabLayout() {
  const router = useRouter();
  const pathname = usePathname();
  const theme = useTheme();

  const user = useSelector((state: RootState) => state.auth.user);

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
        name="xplore"
        options={{
          title: 'xplore',
          tabBarIcon: ({ size, color }) => (
            <AntDesign name="appstore" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
