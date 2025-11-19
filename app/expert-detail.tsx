import React, { useState, useEffect, Platform } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  useColorScheme,
  ActivityIndicator,
  Modal,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Spacing, Typography, BorderRadius } from '../constants/Colors';
import { Expert } from '../constants/Types';
import { expertsService } from '../services/expertsService';
import { bookingService } from '../services/bookingService';
import { useAuth } from '../hooks/useAuth';

export default function ExpertDetailScreen() {
  const colorScheme = useColorScheme();
  const colors = colorScheme === 'dark' ? Colors.dark : Colors.light;
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { user } = useAuth();

  const [expert, setExpert] = useState<Expert | null>(null);
  const [loading, setLoading] = useState(true);
  const [showBookingModal, setShowBookingModal] = useState(false);
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

  useEffect(() => {
    loadExpert();
  }, [id]);

  const loadExpert = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const data = await expertsService.getExpertById(id);
      setExpert(data);
    } catch (error) {
      console.error('Error loading expert:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = async () => {
    if (!expert || !user) return;

    try {
      await bookingService.createBooking({
        entrepreneurId: user.id,
        expertId: expert.id,
        expertName: expert.name,
        expertAvatar: expert.avatar,
        service: expert.services[0],
        date: new Date(Date.now() + 86400000),
        duration: 60,
        totalCost: expert.hourlyRate,
        notes: '',
      });

      setShowBookingModal(false);
      showWebAlert(
        'Solicitud enviada',
        'Tu solicitud de asesoría ha sido enviada al experto. Recibirás una confirmación pronto.',
        () => router.back()
      );
    } catch (error) {
      console.error('Error creating booking:', error);
      showWebAlert('Error', 'No se pudo enviar la solicitud. Por favor, intenta de nuevo.');
    }
  };

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!expert) {
    return (
      <View style={[styles.errorContainer, { backgroundColor: colors.background }]}>
        <Text style={[styles.errorText, { color: colors.textSecondary }]}>
          Experto no encontrado
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={[styles.header, { backgroundColor: colors.cardBackground }]}>
          <Image
            source={{ uri: expert.avatar || 'https://i.pravatar.cc/150' }}
            style={styles.avatar}
            contentFit="cover"
          />
          <View style={styles.headerInfo}>
            <View style={styles.nameRow}>
              <Text style={[styles.name, { color: colors.text }]}>{expert.name}</Text>
              {expert.verified && (
                <Ionicons name="checkmark-circle" size={24} color={colors.verified} />
              )}
            </View>
            <View style={styles.ratingRow}>
              <Ionicons name="star" size={18} color={colors.rating} />
              <Text style={[styles.rating, { color: colors.text }]}>
                {expert.rating.toFixed(1)}
              </Text>
              <Text style={[styles.reviews, { color: colors.textSecondary }]}>
                ({expert.reviewCount} reseñas)
              </Text>
            </View>
            <Text style={[styles.experience, { color: colors.textSecondary }]}>
              {expert.experience}
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Acerca de</Text>
          <Text style={[styles.description, { color: colors.textSecondary }]}>
            {expert.description}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Especialidades</Text>
          <View style={styles.tagsContainer}>
            {expert.specialties.map((specialty, index) => (
              <View key={index} style={[styles.tag, { backgroundColor: colors.primary }]}>
                <Text style={[styles.tagText, { color: colors.background }]}>{specialty}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Servicios ofrecidos</Text>
          {expert.services.map((service, index) => (
            <View key={index} style={styles.serviceItem}>
              <Ionicons name="checkmark-circle" size={20} color={colors.success} />
              <Text style={[styles.serviceText, { color: colors.text }]}>{service}</Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Certificaciones</Text>
          {expert.certifications.map((cert, index) => (
            <View key={index} style={styles.certItem}>
              <Ionicons name="ribbon" size={20} color={colors.primary} />
              <Text style={[styles.certText, { color: colors.textSecondary }]}>{cert}</Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Testimonios</Text>
          {expert.testimonials.map(testimonial => (
            <View
              key={testimonial.id}
              style={[styles.testimonialCard, { backgroundColor: colors.backgroundSecondary }]}
            >
              <View style={styles.testimonialHeader}>
                <Text style={[styles.testimonialName, { color: colors.text }]}>
                  {testimonial.clientName}
                </Text>
                <View style={styles.testimonialRating}>
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Ionicons key={i} name="star" size={14} color={colors.rating} />
                  ))}
                </View>
              </View>
              <Text style={[styles.testimonialText, { color: colors.textSecondary }]}>
                {testimonial.comment}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>

      <View style={[styles.footer, { backgroundColor: colors.cardBackground, paddingBottom: insets.bottom }]}>
        <View style={styles.priceContainer}>
          <Text style={[styles.priceLabel, { color: colors.textSecondary }]}>Desde</Text>
          <Text style={[styles.price, { color: colors.primary }]}>${expert.hourlyRate}/hora</Text>
        </View>
        <TouchableOpacity
          style={[styles.bookButton, { backgroundColor: colors.primary }]}
          onPress={() => setShowBookingModal(true)}
        >
          <Text style={[styles.bookButtonText, { color: colors.background }]}>
            Agendar asesoría
          </Text>
        </TouchableOpacity>
      </View>

      <Modal
        visible={showBookingModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowBookingModal(false)}
      >
        <View style={[styles.modalContainer, { backgroundColor: colors.background }]}>
          <View style={[styles.modalHeader, { borderBottomColor: colors.border }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>Confirmar asesoría</Text>
            <TouchableOpacity onPress={() => setShowBookingModal(false)}>
              <Ionicons name="close" size={28} color={colors.text} />
            </TouchableOpacity>
          </View>
          <View style={styles.modalContent}>
            <View style={styles.summaryItem}>
              <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Experto:</Text>
              <Text style={[styles.summaryValue, { color: colors.text }]}>{expert.name}</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Servicio:</Text>
              <Text style={[styles.summaryValue, { color: colors.text }]}>{expert.services[0]}</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Duración:</Text>
              <Text style={[styles.summaryValue, { color: colors.text }]}>1 hora</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Costo:</Text>
              <Text style={[styles.summaryValue, { color: colors.primary }]}>
                ${expert.hourlyRate}
              </Text>
            </View>
            <Text style={[styles.modalNote, { color: colors.textSecondary }]}>
              El experto te contactará para coordinar fecha y hora de la sesión.
            </Text>
          </View>
          <View style={[styles.modalFooter, { paddingBottom: insets.bottom }]}>
            <TouchableOpacity
              style={[styles.confirmButton, { backgroundColor: colors.primary }]}
              onPress={handleBooking}
            >
              <Text style={[styles.confirmButtonText, { color: colors.background }]}>
                Confirmar solicitud
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    ...Typography.body,
  },
  content: {
    paddingBottom: 100,
  },
  header: {
    padding: Spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: BorderRadius.full,
    marginRight: Spacing.md,
  },
  headerInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    marginBottom: Spacing.xs,
  },
  name: {
    ...Typography.h2,
    flex: 1,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: Spacing.xs,
  },
  rating: {
    ...Typography.body,
    fontWeight: '600',
  },
  reviews: {
    ...Typography.bodySmall,
  },
  experience: {
    ...Typography.bodySmall,
  },
  section: {
    padding: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(128, 128, 128, 0.1)',
  },
  sectionTitle: {
    ...Typography.h3,
    marginBottom: Spacing.md,
  },
  description: {
    ...Typography.body,
    lineHeight: 24,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  tag: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
  },
  tagText: {
    ...Typography.bodySmall,
    fontWeight: '600',
  },
  serviceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  serviceText: {
    ...Typography.body,
  },
  certItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  certText: {
    ...Typography.body,
  },
  testimonialCard: {
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.md,
  },
  testimonialHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  testimonialName: {
    ...Typography.h4,
  },
  testimonialRating: {
    flexDirection: 'row',
    gap: 2,
  },
  testimonialText: {
    ...Typography.body,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: 'rgba(128, 128, 128, 0.1)',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  priceLabel: {
    ...Typography.bodySmall,
  },
  price: {
    ...Typography.h3,
    fontWeight: '700',
  },
  bookButton: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
  },
  bookButtonText: {
    ...Typography.button,
  },
  modalContainer: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.md,
    borderBottomWidth: 1,
  },
  modalTitle: {
    ...Typography.h3,
  },
  modalContent: {
    flex: 1,
    padding: Spacing.md,
  },
  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(128, 128, 128, 0.1)',
  },
  summaryLabel: {
    ...Typography.body,
  },
  summaryValue: {
    ...Typography.body,
    fontWeight: '600',
  },
  modalNote: {
    ...Typography.bodySmall,
    marginTop: Spacing.lg,
    textAlign: 'center',
  },
  modalFooter: {
    padding: Spacing.md,
  },
  confirmButton: {
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
  },
  confirmButtonText: {
    ...Typography.button,
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