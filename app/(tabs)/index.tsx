import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  useColorScheme,
  TouchableOpacity,
  Platform,
  Modal,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Spacing, Typography, BorderRadius } from '../../constants/Colors';
import { useExperts } from '../../hooks/useExperts';
import ExpertCard from '../../components/ui/ExpertCard';
import SearchBar from '../../components/ui/SearchBar';
import { Specialty, ServiceType } from '../../constants/Types';

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const colors = colorScheme === 'dark' ? Colors.dark : Colors.light;
  const insets = useSafeAreaInsets();
  const router = useRouter();
  
  const { experts, loading, searchExperts } = useExperts();
  const [refreshing, setRefreshing] = useState(false);

  const handleSearch = async (query: string, specialty?: Specialty, service?: ServiceType) => {
    await searchExperts(query, specialty, service);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await searchExperts('');
    setRefreshing(false);
  };

  const navigateToExpert = (expertId: string) => {
    router.push({
      pathname: '/expert-detail',
      params: { id: expertId },
    });
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background, paddingTop: insets.top }]}>
      <View style={styles.content}>
        <View style={styles.hero}>
          <Text style={[styles.heroTitle, { color: colors.text }]}>
            Conecta con expertos fiscales certificados
          </Text>
          <Text style={[styles.heroSubtitle, { color: colors.textSecondary }]}>
            Encuentra asesoría profesional para tu negocio
          </Text>
        </View>

        <SearchBar onSearch={handleSearch} />

        {loading && !refreshing ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        ) : (
          <FlatList
            data={experts}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <ExpertCard expert={item} onPress={() => navigateToExpert(item.id)} />
            )}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            refreshing={refreshing}
            onRefresh={handleRefresh}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                  No se encontraron expertos con los criterios seleccionados
                </Text>
              </View>
            }
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.md,
  },
  hero: {
    paddingVertical: Spacing.lg,
  },
  heroTitle: {
    ...Typography.h2,
    marginBottom: Spacing.xs,
  },
  heroSubtitle: {
    ...Typography.body,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    paddingBottom: Spacing.xxl,
  },
  emptyContainer: {
    paddingTop: Spacing.xxl,
    alignItems: 'center',
  },
  emptyText: {
    ...Typography.body,
    textAlign: 'center',
  },
});