import { Stack } from 'expo-router';

export default function ProfileLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="edit" />
      <Stack.Screen name="notifications" />
      <Stack.Screen name="payment-methods" />
      <Stack.Screen name="privacy" />
      <Stack.Screen name="settings" />
      <Stack.Screen name="help" />
    </Stack>
  );
}