import { Stack } from 'expo-router';
import { Colors } from '@/constants/Colors';

export default function AuthLayout() {
  const colors = Colors.dark;

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: {
          backgroundColor: colors.background,
        },
      }}
    >
      <Stack.Screen name="login" />
      <Stack.Screen name="register" />
    </Stack>
  );
}
