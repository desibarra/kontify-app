import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, useColorScheme } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { Expert } from '../../constants/Types';
import { Colors, Spacing, BorderRadius, Typography } from '../../constants/Colors';

interface ExpertCardProps {
  expert: Expert;
  onPress: () => void;
}

export default function ExpertCard({ expert, onPress }: ExpertCardProps) {
  const colorScheme = useColorScheme();
  const colors = colorScheme === 'dark' ? Colors.dark : Colors.light;

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: colors.cardBackground, borderColor: colors.cardBorder }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.header}>
        <Image
          source={{ uri: expert.avatar || 'https://i.pravatar.cc/150' }}
          style={styles.avatar}
          contentFit="cover"
        />
        <View style={styles.headerInfo}>
          <View style={styles.nameRow}>
            <Text style={[styles.name, { color: colors.text }]} numberOfLines={1}>
              {expert.name}
            </Text>
            {expert.verified && (
              <Ionicons name="checkmark-circle" size={18} color={colors.verified} />
            )}
          </View>
          <View style={styles.ratingRow}>
            <Ionicons name="star" size={14} color={colors.rating} />
            <Text style={[styles.rating, { color: colors.text }]}>
              {expert.rating.toFixed(1)}
            </Text>
            <Text style={[styles.reviews, { color: colors.textSecondary }]}>
              ({expert.reviewCount} reseñas)
            </Text>
          </View>
        </View>
      </View>

      <Text style={[styles.description, { color: colors.textSecondary }]} numberOfLines={2}>
        {expert.description}
      </Text>

      <View style={styles.specialtiesContainer}>
        {expert.specialties.slice(0, 3).map((specialty, index) => (
          <View
            key={index}
            style={[styles.specialtyTag, { backgroundColor: colors.backgroundTertiary }]}
          >
            <Text style={[styles.specialtyText, { color: colors.textSecondary }]}>
              {specialty}
            </Text>
          </View>
        ))}
      </View>

      <View style={styles.footer}>
        <View style={styles.rateContainer}>
          <Text style={[styles.rateLabel, { color: colors.textSecondary }]}>Desde</Text>
          <Text style={[styles.rate, { color: colors.primary }]}>
            ${expert.hourlyRate}/hora
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color={colors.textTertiary} />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    marginBottom: Spacing.md,
  },
  header: {
    flexDirection: 'row',
    marginBottom: Spacing.md,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: BorderRadius.full,
    marginRight: Spacing.md,
  },
  headerInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    marginBottom: Spacing.xs,
  },
  name: {
    ...Typography.h4,
    flex: 1,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  rating: {
    ...Typography.bodySmall,
    fontWeight: '600',
  },
  reviews: {
    ...Typography.caption,
  },
  description: {
    ...Typography.bodySmall,
    marginBottom: Spacing.md,
  },
  specialtiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xs,
    marginBottom: Spacing.md,
  },
  specialtyTag: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.sm,
  },
  specialtyText: {
    ...Typography.caption,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: 'rgba(128, 128, 128, 0.1)',
  },
  rateContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  rateLabel: {
    ...Typography.caption,
  },
  rate: {
    ...Typography.h4,
    fontWeight: '700',
  },
});