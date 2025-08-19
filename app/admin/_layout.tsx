import { Stack } from 'expo-router';

export default function AdminLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="users" />
      <Stack.Screen name="venues" />
      <Stack.Screen name="bookings" />
      <Stack.Screen name="analytics" />
      <Stack.Screen name="settings" />
      <Stack.Screen name="user-details/[id]" />
      <Stack.Screen name="venue-details/[id]" />
    </Stack>
  );
}