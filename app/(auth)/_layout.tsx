import { Stack } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { KontifyLogo } from '@/components/ui/KontifyLogo';

export default function AuthLayout() {
  const colors = Colors.dark;

  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerTitle: () => <KontifyLogo size="small" />,
        headerStyle: {
          backgroundColor: colors.background,
        },
        headerShadowVisible: false,
        contentStyle: {
          backgroundColor: colors.background,
        },
      }}
    >
      <Stack.Screen name="login" />
      <Stack.Screen name="register" />
      <Stack.Screen name="role-selection" />
    </Stack>
  );
}
