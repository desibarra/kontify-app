import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, useColorScheme } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '@/constants/Colors';

export default function ExpertsOnboardingScreen() {
    // Always use dark theme
    const colors = Colors.dark;
    const router = useRouter();

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={styles.content}>
                <View style={[styles.iconContainer, { backgroundColor: colors.backgroundElevated, borderColor: colors.primary }]}>
                    <Ionicons name="rocket" size={80} color={colors.primary} />
                </View>

                <Text style={[styles.title, { color: colors.text }]}>
                    ¡Bienvenido a Kontify+!
                </Text>

                <Text style={[styles.message, { color: colors.textSecondary }]}>
                    Tu perfil está siendo revisado por nuestro equipo
                </Text>

                <View style={[styles.infoBox, { backgroundColor: colors.cardBackground, borderColor: colors.border }, Shadows.sm]}>
                    <Ionicons name="time" size={24} color={colors.primary} />
                    <Text style={[styles.infoText, { color: colors.textSecondary }]}>
                        El proceso de verificación toma entre 24-48 horas
                    </Text>
                </View>

                <View style={[styles.nextStepsBox, { backgroundColor: colors.cardBackground, borderColor: colors.border }, Shadows.md]}>
                    <Text style={[styles.nextStepsTitle, { color: colors.text }]}>
                        Mientras tanto:
                    </Text>
                    <View style={styles.step}>
                        <Ionicons name="checkmark-circle-outline" size={20} color={colors.primary} />
                        <Text style={[styles.stepText, { color: colors.textSecondary }]}>
                            Revisa tu email para confirmar tu cuenta
                        </Text>
                    </View>
                    <View style={styles.step}>
                        <Ionicons name="checkmark-circle-outline" size={20} color={colors.primary} />
                        <Text style={[styles.stepText, { color: colors.textSecondary }]}>
                            Prepara tus documentos de identidad
                        </Text>
                    </View>
                    <View style={styles.step}>
                        <Ionicons name="checkmark-circle-outline" size={20} color={colors.primary} />
                        <Text style={[styles.stepText, { color: colors.textSecondary }]}>
                            Familiarízate con la plataforma
                        </Text>
                    </View>
                </View>

                <TouchableOpacity
                    style={[styles.button, { backgroundColor: colors.primary }, Shadows.green]}
                    onPress={() => router.push('/experts-plans')}
                >
                    <Text style={[styles.buttonText, { color: colors.background }]}>
                        Ver Planes de Suscripción
                    </Text>
                </TouchableOpacity>
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
        justifyContent: 'center',
        alignItems: 'center',
        padding: Spacing.lg,
    },
    iconContainer: {
        width: 120,
        height: 120,
        borderRadius: 60,
        borderWidth: 2,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: Spacing.xl,
    },
    title: {
        ...Typography.h1,
        fontSize: 32,
        fontWeight: '700',
        marginBottom: Spacing.md,
        textAlign: 'center',
    },
    message: {
        ...Typography.body,
        fontSize: 18,
        textAlign: 'center',
        marginBottom: Spacing.xl,
        lineHeight: 26,
    },
    infoBox: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: Spacing.md,
        borderRadius: BorderRadius.md,
        borderWidth: 1,
        marginBottom: Spacing.lg,
        width: '100%',
    },
    infoText: {
        ...Typography.body,
        fontSize: 14,
        marginLeft: Spacing.sm,
        flex: 1,
    },
    nextStepsBox: {
        padding: Spacing.lg,
        borderRadius: BorderRadius.lg,
        borderWidth: 1,
        marginBottom: Spacing.xl,
        width: '100%',
    },
    nextStepsTitle: {
        ...Typography.h3,
        fontSize: 18,
        fontWeight: '600',
        marginBottom: Spacing.md,
    },
    step: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: Spacing.sm,
    },
    stepText: {
        ...Typography.body,
        fontSize: 15,
        marginLeft: Spacing.sm,
        flex: 1,
    },
    button: {
        paddingVertical: Spacing.md + 2,
        paddingHorizontal: Spacing.xl,
        borderRadius: BorderRadius.lg,
        width: '100%',
        alignItems: 'center',
    },
    buttonText: {
        ...Typography.h3,
        fontSize: 18,
        fontWeight: '700',
    },
});

