import React from 'react';
import { View, Text, StyleSheet, useColorScheme } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing } from '../../constants/Colors';

export default function AuthorityBadges() {
    // Always use dark theme
    const colors = Colors.dark;

    const badges = [
        { icon: 'shield-checkmark', label: 'Verificado por SAT' },
        { icon: 'ribbon', label: 'Certificado IMCP' },
        { icon: 'star', label: '4.9/5 calificación' },
        { icon: 'people', label: '+10k clientes atendidos' },
    ];

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <Text style={[styles.title, { color: colors.textSecondary }]}>
                Respaldados por las mejores instituciones
            </Text>

            <View style={styles.badgesContainer}>
                {badges.map((badge, index) => (
                    <View key={index} style={styles.badge}>
                        <Ionicons name={badge.icon as any} size={32} color={colors.primary} />
                        <Text style={[styles.badgeLabel, { color: colors.text }]}>
                            {badge.label}
                        </Text>
                    </View>
                ))}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingVertical: Spacing.xl,
        paddingHorizontal: Spacing.lg,
    },
    title: {
        ...Typography.body,
        fontSize: 14,
        textAlign: 'center',
        marginBottom: Spacing.lg,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    badgesContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        gap: Spacing.md,
    },
    badge: {
        alignItems: 'center',
        width: 140,
    },
    badgeLabel: {
        ...Typography.caption,
        fontSize: 12,
        marginTop: Spacing.xs,
        textAlign: 'center',
    },
});
