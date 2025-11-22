import React from 'react';
import { View, Text, StyleSheet, useColorScheme } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../../constants/Colors';

export default function Benefits() {
    // Always use dark theme
    const colors = Colors.dark;

    const benefits = [
        {
            icon: 'people',
            title: 'Clientes precalificados',
            description: 'Nuestra IA filtra y asigna casos según tu especialidad',
            highlight: true,
        },
        {
            icon: 'cash',
            title: 'Pago garantizado',
            description: 'Cobra antes de cada consulta, sin riesgo de impago',
            highlight: true,
        },
        {
            icon: 'time',
            title: 'Agenda flexible',
            description: 'Trabaja cuando quieras, desde donde quieras',
            highlight: false,
        },
        {
            icon: 'trending-up',
            title: 'Ingresos predecibles',
            description: 'Construye una base de clientes recurrentes',
            highlight: false,
        },
        {
            icon: 'shield-checkmark',
            title: 'Soporte legal',
            description: 'Respaldo jurídico en cada caso que atiendas',
            highlight: false,
        },
        {
            icon: 'school',
            title: 'Capacitación continua',
            description: 'Acceso a webinars y actualizaciones fiscales',
            highlight: false,
        },
    ];

    return (
        <View style={[styles.container, { backgroundColor: colors.backgroundSecondary }]}>
            <Text style={[styles.title, { color: colors.text }]}>
                Beneficios reales para tu práctica
            </Text>

            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                Más que una plataforma, un socio estratégico
            </Text>

            <View style={styles.benefitsGrid}>
                {benefits.map((benefit, index) => (
                    <View
                        key={index}
                        style={[
                            styles.benefitCard,
                            { backgroundColor: colors.cardBackground, borderColor: colors.border },
                            benefit.highlight && { borderColor: colors.primary, borderWidth: 2 },
                            Shadows.md,
                        ]}
                    >
                        <Ionicons
                            name={benefit.icon as any}
                            size={40}
                            color={benefit.highlight ? colors.primary : colors.textSecondary}
                        />
                        <Text style={[styles.benefitTitle, { color: colors.text }]}>
                            {benefit.title}
                        </Text>
                        <Text style={[styles.benefitDescription, { color: colors.textSecondary }]}>
                            {benefit.description}
                        </Text>
                    </View>
                ))}
            </View>

            <View style={[styles.comparisonBox, { backgroundColor: colors.cardBackground, borderColor: colors.border }, Shadows.sm]}>
                <Text style={[styles.comparisonTitle, { color: colors.text }]}>
                    📊 Kontify+ vs. Freelance tradicional
                </Text>
                <View style={styles.comparisonRow}>
                    <Text style={[styles.comparisonLabel, { color: colors.textSecondary }]}>
                        Prospección:
                    </Text>
                    <Text style={[styles.comparisonValue, { color: colors.primary }]}>
                        0 horas (nosotros lo hacemos)
                    </Text>
                </View>
                <View style={styles.comparisonRow}>
                    <Text style={[styles.comparisonLabel, { color: colors.textSecondary }]}>
                        Riesgo de impago:
                    </Text>
                    <Text style={[styles.comparisonValue, { color: colors.primary }]}>
                        0% (pago anticipado)
                    </Text>
                </View>
                <View style={styles.comparisonRow}>
                    <Text style={[styles.comparisonLabel, { color: colors.textSecondary }]}>
                        Inversión inicial:
                    </Text>
                    <Text style={[styles.comparisonValue, { color: colors.primary }]}>
                        $0 MXN
                    </Text>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingVertical: Spacing.xxl,
        paddingHorizontal: Spacing.lg,
    },
    title: {
        ...Typography.h2,
        fontSize: 28,
        fontWeight: '700',
        marginBottom: Spacing.sm,
        textAlign: 'center',
    },
    subtitle: {
        ...Typography.body,
        fontSize: 16,
        marginBottom: Spacing.xl,
        textAlign: 'center',
    },
    benefitsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginBottom: Spacing.xl,
    },
    benefitCard: {
        width: '48%',
        padding: Spacing.lg,
        borderRadius: BorderRadius.lg,
        borderWidth: 1,
        marginBottom: Spacing.md,
        minHeight: 160,
    },
    benefitTitle: {
        ...Typography.h3,
        fontSize: 16,
        fontWeight: '600',
        marginTop: Spacing.sm,
        marginBottom: Spacing.xs,
    },
    benefitDescription: {
        ...Typography.body,
        fontSize: 14,
        lineHeight: 20,
    },
    comparisonBox: {
        padding: Spacing.lg,
        borderRadius: BorderRadius.lg,
        borderWidth: 1,
    },
    comparisonTitle: {
        ...Typography.h3,
        fontSize: 18,
        fontWeight: '600',
        marginBottom: Spacing.md,
    },
    comparisonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: Spacing.sm,
    },
    comparisonLabel: {
        ...Typography.body,
        fontSize: 15,
    },
    comparisonValue: {
        ...Typography.body,
        fontSize: 15,
        fontWeight: '600',
    },
});
