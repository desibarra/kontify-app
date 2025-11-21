import React from 'react';
import { View, Text, StyleSheet, useColorScheme } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../../constants/Colors';

export default function HowItWorks() {
    // Always use dark theme
    const colors = Colors.dark;

    const steps = [
        {
            icon: 'person-add',
            title: 'Regístrate',
            description: 'Completa tu perfil profesional en 5 minutos',
        },
        {
            icon: 'calendar',
            title: 'Define tu agenda',
            description: 'Tú decides cuándo y cuánto trabajar',
        },
        {
            icon: 'people',
            title: 'Recibe clientes',
            description: 'Nuestra IA te conecta con casos ideales para ti',
        },
        {
            icon: 'cash',
            title: 'Cobra garantizado',
            description: 'Pago asegurado antes de cada consulta',
        },
    ];

    return (
        <View style={[styles.container, { backgroundColor: colors.backgroundSecondary }]}>
            <Text style={[styles.title, { color: colors.text }]}>
                ¿Cómo funciona Kontify+ para ti?
            </Text>

            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                Simple, transparente y diseñado para profesionales
            </Text>

            <View style={styles.stepsContainer}>
                {steps.map((step, index) => (
                    <View key={index} style={styles.step}>
                        <View style={[styles.iconContainer, { backgroundColor: colors.primary }]}>
                            <Ionicons name={step.icon as any} size={32} color={colors.background} />
                        </View>

                        <View style={styles.stepContent}>
                            <Text style={[styles.stepNumber, { color: colors.textTertiary }]}>
                                Paso {index + 1}
                            </Text>
                            <Text style={[styles.stepTitle, { color: colors.text }]}>
                                {step.title}
                            </Text>
                            <Text style={[styles.stepDescription, { color: colors.textSecondary }]}>
                                {step.description}
                            </Text>
                        </View>
                    </View>
                ))}
            </View>

            <View style={[styles.highlightBox, { backgroundColor: colors.backgroundElevated, borderColor: colors.primary }]}>
                <Text style={[styles.highlightText, { color: colors.primary }]}>
                    ✨ Tú decides tu tarifa, horarios y especialidades
                </Text>
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
    stepsContainer: {
        marginBottom: Spacing.xl,
    },
    step: {
        flexDirection: 'row',
        marginBottom: Spacing.xl,
        alignItems: 'flex-start',
    },
    iconContainer: {
        width: 64,
        height: 64,
        borderRadius: 32,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: Spacing.md,
    },
    stepContent: {
        flex: 1,
    },
    stepNumber: {
        ...Typography.caption,
        fontSize: 12,
        marginBottom: Spacing.xs,
        textTransform: 'uppercase',
    },
    stepTitle: {
        ...Typography.h3,
        fontSize: 20,
        fontWeight: '600',
        marginBottom: Spacing.xs,
    },
    stepDescription: {
        ...Typography.body,
        fontSize: 15,
        lineHeight: 22,
    },
    highlightBox: {
        padding: Spacing.lg,
        borderRadius: BorderRadius.lg,
        borderWidth: 2,
        alignItems: 'center',
    },
    highlightText: {
        ...Typography.body,
        fontSize: 16,
        fontWeight: '600',
        textAlign: 'center',
    },
});
