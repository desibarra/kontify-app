import { Stack } from 'expo-router';
import { AuthProvider } from '@/contexts/AuthContext';
import { ExpertsProvider } from '@/contexts/ExpertsContext';
import { useColorScheme } from 'react-native';
import { Colors } from '@/constants/Colors';

export default function RootLayout() {
  // Always use dark theme
  const colors = Colors.dark;

  // SIMPLIFICACIÓN EXTREMA PARA DEBUGGING
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
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="landing" options={{ headerShown: false }} />
          <Stack.Screen
            name="expert-detail"
            options={{
              title: 'Perfil del Experto',
              presentation: 'modal',
            }}
          />
          <Stack.Screen
            name="experts-landing"
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="experts-register"
            options={{ title: 'Registro de Experto' }}
          />
          <Stack.Screen
            name="experts-onboarding"
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="experts-profile-form"
            options={{ title: 'Completar Perfil' }}
          />
          <Stack.Screen
            name="experts-profile-summary"
            options={{ title: 'Resumen del Perfil' }}
          />
          <Stack.Screen
            name="experts-plans"
            options={{ title: 'Planes de Suscripción' }}
          />
          <Stack.Screen
            name="experts-checkout"
            options={{ title: 'Checkout' }}
          />
          <Stack.Screen
            name="experts-payment-success"
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="experts-dashboard"
            options={{ title: 'Dashboard' }}
          />
          <Stack.Screen
            name="experts-leads"
            options={{ title: 'Mis Leads' }}
          />
          <Stack.Screen
            name="experts-lead-detail"
            options={{ title: 'Detalle del Lead' }}
          />
          <Stack.Screen
            name="experts-report"
            options={{ title: 'Reportes' }}
          />
        </Stack>
      </ExpertsProvider>
    </AuthProvider>
  );
}
