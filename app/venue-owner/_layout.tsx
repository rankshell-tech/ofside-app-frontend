import { Stack } from 'expo-router';

export default function VenueOwnerLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="add-venue" />
      <Stack.Screen name="edit-venue/[id]" />
      <Stack.Screen name="manage-bookings" />
      <Stack.Screen name="manage-slots" />
      <Stack.Screen name="pricing" />
      <Stack.Screen name="earnings" />
      <Stack.Screen name="withdraw" />
    </Stack>
  );
}