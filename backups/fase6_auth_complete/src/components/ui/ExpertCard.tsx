import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, useColorScheme } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { Expert } from '../../constants/Types';
import { Colors, Spacing, BorderRadius, Typography, Shadows } from '../../constants/Colors';

interface ExpertCardProps {
  expert: Expert;
  onPress: () => void;
}

export default function ExpertCard({ expert, onPress }: ExpertCardProps) {
  // Always use dark theme for premium look
  const colors = Colors.dark;

  return (
    <TouchableOpacity
      style={[
        styles.card,
        {
          backgroundColor: colors.cardBackground,
          borderColor: colors.cardBorder,
        },
        Shadows.md,
      ]}
      onPress={onPress}
      activeOpacity={0.8}
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
              <Ionicons name="checkmark-circle" size={18} color={colors.primary} />
            )}
          </View>
          <View style={styles.ratingRow}>
            <Ionicons name="star" size={16} color={colors.primary} />
            <Text style={[styles.rating, { color: colors.primary }]}>
              {expert.rating.toFixed(1)}
            </Text>
            <Text style={[styles.reviews, { color: colors.textTertiary }]}>
              ({expert.reviewCount})
            </Text>
          </View>
        </View>
        <View style={styles.priceContainer}>
          <Text style={[styles.priceLabel, { color: colors.textTertiary }]}>Desde</Text>
          <Text style={[styles.price, { color: colors.primary }]}>
            ${expert.hourlyRate}
          </Text>
          <Text style={[styles.priceUnit, { color: colors.textTertiary }]}>/hr</Text>
        </View>
      </View>

      <Text style={[styles.description, { color: colors.textSecondary }]} numberOfLines={2}>
        {expert.description}
      </Text>

      <View style={styles.specialtiesContainer}>
        {expert.specialties.slice(0, 3).map((specialty, index) => (
          <View
            key={index}
            style={[
              styles.specialtyTag,
              {
                backgroundColor: colors.backgroundElevated,
                borderColor: colors.border,
              },
            ]}
          >
            <Text style={[styles.specialtyText, { color: colors.secondary }]}>
              {specialty}
            </Text>
          </View>
        ))}
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
    marginBottom: Spacing.sm,
    alignItems: 'flex-start',
  },
  avatar: {
    width: 56,
    height: 56,
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
    marginBottom: 4,
  },
  name: {
    ...Typography.h4,
    fontSize: 17,
    flex: 1,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  rating: {
    ...Typography.bodySmall,
    fontWeight: '700',
    fontSize: 15,
  },
  reviews: {
    ...Typography.caption,
    fontSize: 13,
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  priceLabel: {
    ...Typography.caption,
    fontSize: 11,
    marginBottom: 2,
  },
  price: {
    ...Typography.h3,
    fontSize: 20,
    fontWeight: '700',
  },
  priceUnit: {
    ...Typography.caption,
    fontSize: 11,
  },
  description: {
    ...Typography.bodySmall,
    marginBottom: Spacing.sm,
    lineHeight: 20,
  },
  specialtiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xs,
  },
  specialtyTag: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 5,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
  },
  specialtyText: {
    ...Typography.caption,
    fontSize: 12,
    fontWeight: '500',
  },
});