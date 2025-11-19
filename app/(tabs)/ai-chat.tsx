import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AIChat from '../../components/ui/AIChat';
import { useAuth } from '../../hooks/useAuth';
import { Specialty, CaseSummary, UserContactData } from '../../constants/Types';

export default function AIChatScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();

  const navigateToExperts = (data?: {
    specialty?: Specialty;
    caseSummary?: CaseSummary;
    userContactData?: UserContactData;
  }) => {
    // Navigate to experts tab with context data
    router.push({
      pathname: '/(tabs)',
      params: {
        fromAI: 'true',
        specialty: data?.specialty || '',
        caseSummary: data?.caseSummary ? JSON.stringify(data.caseSummary) : '',
        userContactData: data?.userContactData ? JSON.stringify(data.userContactData) : '',
      },
    });
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <AIChat userId={user?.id || 'guest'} onNavigateToExperts={navigateToExperts} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});