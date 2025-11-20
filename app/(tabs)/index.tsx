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
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, Typography, BorderRadius } from '../../constants/Colors';
import { useExperts } from '../../hooks/useExperts';
import ExpertCard from '../../components/ui/ExpertCard';
import SearchBar from '../../components/ui/SearchBar';
import { Specialty, ServiceType } from '../../constants/Types';


export default function HomeScreen() {
  // Always use dark theme
  const colors = Colors.dark;
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
    <View style={[styles.container, { backgroundColor: colors.backgroundSecondary, paddingTop: insets.top }]}>
      <View style={styles.content}>
        <View style={[styles.hero, { backgroundColor: colors.background }]}>
          <Text style={[styles.heroTitle, { color: colors.text }]}>
            Expertos Fiscales Certificados
          </Text>
          <Text style={[styles.heroSubtitle, { color: colors.textSecondary }]}>
            Asesoría profesional para tu negocio
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
                <Ionicons name="search-outline" size={64} color={colors.textTertiary} />
                <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                  No se encontraron expertos
                </Text>
                <Text style={[styles.emptySubtext, { color: colors.textTertiary }]}>
                  Intenta ajustar tus filtros de búsqueda
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
    paddingVertical: Spacing.xl,
    paddingHorizontal: Spacing.md,
    marginHorizontal: -Spacing.md,
    marginBottom: Spacing.md,
  },
  heroTitle: {
    ...Typography.h2,
    fontSize: 28,
    marginBottom: Spacing.xs,
    textAlign: 'center',
  },
  heroSubtitle: {
    ...Typography.body,
    textAlign: 'center',
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
    paddingTop: Spacing.xxxl,
    alignItems: 'center',
    gap: Spacing.md,
  },
  emptyText: {
    ...Typography.h4,
    textAlign: 'center',
  },
  emptySubtext: {
    ...Typography.bodySmall,
    textAlign: 'center',
  },
});