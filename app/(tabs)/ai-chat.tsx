import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AIChat from '@/components/ui/AIChat';
import { useAuth } from '@/hooks/useAuth';
import { Specialty, CaseSummary, UserContactData } from '@/constants/Types';

export default function AIChatScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user, profile } = useAuth();

  console.log('🎯 AI Chat Screen - User:', user?.id);
  console.log('👤 AI Chat Screen - Profile:', profile?.email, profile?.role);

  const navigateToExperts = (data?: {
    specialty?: Specialty;
    caseSummary?: CaseSummary;
    userContactData?: UserContactData;
  }) => {
    // Navigate to experts tab with context data
    router.push({
      pathname: '/(tabs)/index',
      params: {
        specialty: data?.specialty || '',
        fromChat: 'true',
      },
    });
  };

  // Asegurar que siempre use el userId real si está autenticado
  const effectiveUserId = user?.id || 'guest';

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <AIChat 
        userId={effectiveUserId} 
        onNavigateToExperts={navigateToExperts} 
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
