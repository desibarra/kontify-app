import React, { useState, useEffect, Platform } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  useColorScheme,
  ActivityIndicator,
  Modal,
} from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Spacing, Typography, BorderRadius } from '../../constants/Colors';
import { Expert } from '../../constants/Types';
import { expertsService } from '../../services/expertsService';

export default function AdminScreen() {
  const colorScheme = useColorScheme();
  const colors = colorScheme === 'dark' ? Colors.dark : Colors.light;
  const insets = useSafeAreaInsets();

  const [pendingExperts, setPendingExperts] = useState<Expert[]>([]);
  const [loading, setLoading] = useState(true);
  const [alertConfig, setAlertConfig] = useState<{
    visible: boolean;
    title: string;
    message: string;
    onOk?: () => void;
  }>({ visible: false, title: '', message: '' });

  const showWebAlert = (title: string, message: string, onOk?: () => void) => {
    if (Platform.OS === 'web') {
      setAlertConfig({ visible: true, title, message, onOk });
    }
  };

  const loadPendingExperts = async () => {
    setLoading(true);
    try {
      const experts = await expertsService.getPendingExperts();
      setPendingExperts(experts);
    } catch (error) {
      console.error('Error loading pending experts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPendingExperts();
  }, []);

  const handleApprove = async (expertId: string) => {
    const success = await expertsService.approveExpert(expertId);
    if (success) {
      showWebAlert('Éxito', 'Experto aprobado correctamente', () => {
        loadPendingExperts();
      });
    } else {
      showWebAlert('Error', 'No se pudo aprobar el experto');
    }
  };

  const renderExpertItem = ({ item }: { item: Expert }) => (
    <View style={[styles.expertCard, { backgroundColor: colors.cardBackground, borderColor: colors.cardBorder }]}>
      <View style={styles.expertHeader}>
        <Image
          source={{ uri: item.avatar || 'https://i.pravatar.cc/150' }}
          style={styles.avatar}
          contentFit="cover"
        />
        <View style={styles.expertInfo}>
          <Text style={[styles.expertName, { color: colors.text }]}>{item.name}</Text>
          <Text style={[styles.expertEmail, { color: colors.textSecondary }]}>{item.email}</Text>
        </View>
      </View>

      <View style={styles.detailsSection}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Especialidades:</Text>
        <View style={styles.tagsContainer}>
          {item.specialties.map((spec, index) => (
            <View key={index} style={[styles.tag, { backgroundColor: colors.backgroundTertiary }]}>
              <Text style={[styles.tagText, { color: colors.textSecondary }]}>{spec}</Text>
            </View>
          ))}
        </View>

        <Text style={[styles.sectionTitle, { color: colors.text }]}>Servicios:</Text>
        <View style={styles.tagsContainer}>
          {item.services.map((service, index) => (
            <View key={index} style={[styles.tag, { backgroundColor: colors.backgroundTertiary }]}>
              <Text style={[styles.tagText, { color: colors.textSecondary }]}>{service}</Text>
            </View>
          ))}
        </View>

        <Text style={[styles.description, { color: colors.textSecondary }]}>{item.description}</Text>

        <View style={styles.rateContainer}>
          <Text style={[styles.rateLabel, { color: colors.textSecondary }]}>Tarifa por hora:</Text>
          <Text style={[styles.rate, { color: colors.primary }]}>${item.hourlyRate}</Text>
        </View>
      </View>

      <View style={styles.actionsContainer}>
        <TouchableOpacity
          style={[styles.approveButton, { backgroundColor: colors.success }]}
          onPress={() => handleApprove(item.id)}
        >
          <Ionicons name="checkmark-circle" size={20} color="#FFF" />
          <Text style={styles.approveButtonText}>Aprobar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.rejectButton, { backgroundColor: colors.error }]}
          onPress={() => showWebAlert('Rechazar', 'Función en desarrollo')}
        >
          <Ionicons name="close-circle" size={20} color="#FFF" />
          <Text style={styles.rejectButtonText}>Rechazar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background, paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Panel de Administración</Text>
        <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
          {pendingExperts.length} {pendingExperts.length === 1 ? 'experto pendiente' : 'expertos pendientes'} de aprobación
        </Text>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <FlatList
          data={pendingExperts}
          keyExtractor={item => item.id}
          renderItem={renderExpertItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="checkmark-done-circle-outline" size={64} color={colors.textTertiary} />
              <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                No hay expertos pendientes de aprobación
              </Text>
            </View>
          }
        />
      )}

      {Platform.OS === 'web' && (
        <Modal visible={alertConfig.visible} transparent animationType="fade">
          <View style={styles.alertOverlay}>
            <View style={[styles.alertBox, { backgroundColor: colors.cardBackground }]}>
              <Text style={[styles.alertTitle, { color: colors.text }]}>{alertConfig.title}</Text>
              <Text style={[styles.alertMessage, { color: colors.textSecondary }]}>
                {alertConfig.message}
              </Text>
              <TouchableOpacity
                style={[styles.alertButton, { backgroundColor: colors.primary }]}
                onPress={() => {
                  alertConfig.onOk?.();
                  setAlertConfig(prev => ({ ...prev, visible: false }));
                }}
              >
                <Text style={[styles.alertButtonText, { color: colors.background }]}>OK</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: Spacing.md,
  },
  headerTitle: {
    ...Typography.h2,
    marginBottom: Spacing.xs,
  },
  headerSubtitle: {
    ...Typography.body,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    padding: Spacing.md,
    paddingBottom: Spacing.xxl,
  },
  expertCard: {
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    marginBottom: Spacing.md,
  },
  expertHeader: {
    flexDirection: 'row',
    marginBottom: Spacing.md,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: BorderRadius.full,
    marginRight: Spacing.md,
  },
  expertInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  expertName: {
    ...Typography.h4,
    marginBottom: Spacing.xs,
  },
  expertEmail: {
    ...Typography.bodySmall,
  },
  detailsSection: {
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    ...Typography.h4,
    fontSize: 14,
    marginTop: Spacing.sm,
    marginBottom: Spacing.xs,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xs,
    marginBottom: Spacing.sm,
  },
  tag: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.sm,
  },
  tagText: {
    ...Typography.caption,
  },
  description: {
    ...Typography.bodySmall,
    marginTop: Spacing.sm,
  },
  rateContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
    marginTop: Spacing.sm,
  },
  rateLabel: {
    ...Typography.bodySmall,
  },
  rate: {
    ...Typography.h4,
    fontWeight: '700',
  },
  actionsContainer: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  approveButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
  },
  approveButtonText: {
    ...Typography.button,
    color: '#FFF',
  },
  rejectButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
  },
  rejectButtonText: {
    ...Typography.button,
    color: '#FFF',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: Spacing.xxl,
  },
  emptyText: {
    ...Typography.body,
    textAlign: 'center',
    marginTop: Spacing.md,
  },
  alertOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  alertBox: {
    padding: 20,
    borderRadius: 8,
    minWidth: 280,
  },
  alertTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  alertMessage: {
    fontSize: 16,
    marginBottom: 20,
  },
  alertButton: {
    padding: 10,
    borderRadius: 4,
    alignItems: 'center',
  },
  alertButtonText: {
    fontWeight: 'bold',
  },
});