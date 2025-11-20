import { Stack } from 'expo-router';
import { AuthProvider } from '../contexts/AuthContext';
import { ExpertsProvider } from '../contexts/ExpertsContext';
import { useColorScheme } from 'react-native';
import { Colors } from '../constants/Colors';

export default function RootLayout() {
  // Always use dark theme
  const colors = Colors.dark;

  return (
    <AuthProvider>
      <ExpertsProvider>
        <Stack
          screenOptions={{
            headerStyle: {
              backgroundColor: colors.backgroundSecondary,
            },
            headerTintColor: colors.text,
            headerShadowVisible: false,
            headerTitleStyle: {
              fontWeight: '600',
            },
            contentStyle: {
              backgroundColor: colors.backgroundSecondary,
            },
          }}
        >
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="(experts)" options={{ headerShown: false }} />
          <Stack.Screen
            name="expert-detail"
            options={{
              title: 'Perfil del Experto',
              presentation: 'modal',
            }}
          />
        </Stack>
      </ExpertsProvider>
    </AuthProvider>
  );
}