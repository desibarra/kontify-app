import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, useColorScheme } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../../constants/Colors';

export default function HeroSection() {
    // Always use dark theme
    const colors = Colors.dark;
    const router = useRouter();

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={styles.content}>
                <Text style={[styles.headline, { color: colors.text }]}>
                    Transforma tu práctica fiscal en un negocio escalable
                </Text>

                <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                    Únete a la red de expertos fiscales más innovadora de México. Clientes precalificados, ingresos predecibles, libertad total.
                </Text>

                <View style={styles.statsContainer}>
                    <View style={styles.stat}>
                        <Text style={[styles.statNumber, { color: colors.primary }]}>500+</Text>
                        <Text style={[styles.statLabel, { color: colors.textTertiary }]}>
                            Expertos activos
                        </Text>
                    </View>
                    <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
                    <View style={styles.stat}>
                        <Text style={[styles.statNumber, { color: colors.primary }]}>$45k</Text>
                        <Text style={[styles.statLabel, { color: colors.textTertiary }]}>
                            Ingreso promedio/mes
                        </Text>
                    </View>
                    <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
                    <View style={styles.stat}>
                        <Text style={[styles.statNumber, { color: colors.primary }]}>98%</Text>
                        <Text style={[styles.statLabel, { color: colors.textTertiary }]}>
                            Satisfacción
                        </Text>
                    </View>
                </View>

                <TouchableOpacity
                    style={[styles.ctaButton, { backgroundColor: colors.primary }, Shadows.green]}
                    onPress={() => router.push('/experts-register')}
                    activeOpacity={0.9}
                >
                    <Text style={[styles.ctaText, { color: colors.background }]}>
                        Quiero ser experto Kontify+
                    </Text>
                </TouchableOpacity>

                <Text style={[styles.disclaimer, { color: colors.textTertiary }]}>
                    Sin inversión inicial • Tú decides tu agenda • Pago garantizado
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingVertical: Spacing.xxl * 2,
        paddingHorizontal: Spacing.lg,
        minHeight: 600,
        justifyContent: 'center',
    },
    content: {
        maxWidth: 600,
        alignSelf: 'center',
        width: '100%',
    },
    headline: {
        ...Typography.h1,
        fontSize: 36,
        fontWeight: '800',
        marginBottom: Spacing.lg,
        textAlign: 'center',
        lineHeight: 44,
    },
    subtitle: {
        ...Typography.body,
        fontSize: 18,
        marginBottom: Spacing.xl,
        textAlign: 'center',
        lineHeight: 26,
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        marginBottom: Spacing.xl,
        paddingVertical: Spacing.lg,
    },
    stat: {
        alignItems: 'center',
        flex: 1,
    },
    statDivider: {
        width: 1,
        height: 40,
    },
    statNumber: {
        fontSize: 36,
        fontWeight: '800',
        marginBottom: Spacing.xs,
    },
    statLabel: {
        fontSize: 13,
        textAlign: 'center',
        fontWeight: '500',
    },
    ctaButton: {
        paddingVertical: Spacing.md + 2,
        paddingHorizontal: Spacing.xl,
        borderRadius: BorderRadius.lg,
        alignItems: 'center',
        marginBottom: Spacing.md,
    },
    ctaText: {
        ...Typography.h3,
        fontSize: 18,
        fontWeight: '700',
    },
    disclaimer: {
        fontSize: 14,
        textAlign: 'center',
        fontWeight: '500',
    },
});
