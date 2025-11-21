import React from 'react';
import { View, Text, StyleSheet, useColorScheme } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius } from '../../constants/Colors';

export default function Requirements() {
    // Always use dark theme
    const colors = Colors.dark;

    const requirements = [
        'Cédula profesional vigente (Contador, Abogado o Fiscalista)',
        'Mínimo 2 años de experiencia comprobable',
        'Especialidad en áreas fiscales, contables o legales',
        'Disponibilidad para atender casos en línea',
        'Compromiso con la excelencia y ética profesional',
    ];

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <Text style={[styles.title, { color: colors.text }]}>
                Requisitos para unirte
            </Text>

            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                Buscamos profesionales comprometidos con la excelencia
            </Text>

            <View style={styles.requirementsContainer}>
                {requirements.map((requirement, index) => (
                    <View key={index} style={styles.requirement}>
                        <Ionicons name="checkmark-circle" size={24} color={colors.primary} />
                        <Text style={[styles.requirementText, { color: colors.text }]}>
                            {requirement}
                        </Text>
                    </View>
                ))}
            </View>

            <View style={[styles.exclusivityBox, { borderColor: colors.primary, borderWidth: 2 }]}>
                <Ionicons name="ribbon" size={32} color={colors.primary} />
                <Text style={[styles.exclusivityText, { color: colors.text }]}>
                    Proceso de selección exclusivo
                </Text>
                <Text style={[styles.exclusivitySubtext, { color: colors.textSecondary }]}>
                    Solo el 30% de aplicantes son aceptados
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
    requirementsContainer: {
        marginBottom: Spacing.xl,
    },
    requirement: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: Spacing.md,
        paddingHorizontal: Spacing.md,
    },
    requirementText: {
        ...Typography.body,
        fontSize: 16,
        marginLeft: Spacing.md,
        flex: 1,
        lineHeight: 24,
    },
    exclusivityBox: {
        padding: Spacing.lg,
        borderRadius: BorderRadius.lg,
        alignItems: 'center',
    },
    exclusivityText: {
        ...Typography.h3,
        fontSize: 18,
        fontWeight: '600',
        marginTop: Spacing.sm,
        marginBottom: Spacing.xs,
    },
    exclusivitySubtext: {
        ...Typography.body,
        fontSize: 14,
    },
});
