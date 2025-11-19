import { Stack } from 'expo-router';
import { AuthProvider } from '../contexts/AuthContext';
import { ExpertsProvider } from '../contexts/ExpertsContext';
import { useColorScheme } from 'react-native';
import { Colors } from '../constants/Colors';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const colors = colorScheme === 'dark' ? Colors.dark : Colors.light;

  return (
    <AuthProvider>
      <ExpertsProvider>
        <Stack
          screenOptions={{
            headerStyle: {
              backgroundColor: colors.background,
            },
            headerTintColor: colors.text,
            headerShadowVisible: false,
          }}
        >
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
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