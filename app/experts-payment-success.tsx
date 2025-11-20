import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, useColorScheme, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../constants/Colors';

export default function ExpertsPaymentSuccessScreen() {
    // Always use dark theme
    const colors = Colors.dark;
    const router = useRouter();
    const { plan } = useLocalSearchParams<{ plan?: string }>();

    // Validate plan param exists - redirect if missing
    useEffect(() => {
        if (!plan) {
            Alert.alert(
                'Error de pago',
                'No se pudo verificar el plan seleccionado.',
                [{ text: 'OK', onPress: () => router.replace('/experts-plans') }]
            );
        }
    }, [plan]);

    const planNames: Record<string, string> = {
        basic: 'Plan Básico',
        pro: 'Plan Profesional',
        enterprise: 'Plan Enterprise',
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={styles.content}>
                <View style={[styles.iconContainer, { backgroundColor: colors.primary, opacity: 0.1 }]}>
                    <Ionicons name="checkmark-circle" size={80} color={colors.primary} />
                </View>

                <Text style={[styles.title, { color: colors.text }]}>
                    ¡Pago exitoso!
                </Text>

                <Text style={[styles.message, { color: colors.textSecondary }]}>
                    Te has registrado exitosamente en {planNames[plan || 'pro'] || 'Kontify+'}
                </Text>

                <View style={[styles.infoBox, { backgroundColor: colors.cardBackground }]}>
                    <Ionicons name="mail" size={24} color={colors.primary} />
                    <Text style={[styles.infoText, { color: colors.textSecondary }]}>
                        Recibirás un email de confirmación con los siguientes pasos
                    </Text>
                </View>

                <View style={[styles.nextStepsBox, { backgroundColor: colors.cardBackground }]}>
                    <Text style={[styles.nextStepsTitle, { color: colors.text }]}>
                        Próximos pasos:
                    </Text>
                    <View style={styles.step}>
                        <Ionicons name="checkmark-circle-outline" size={20} color={colors.primary} />
                        <Text style={[styles.stepText, { color: colors.textSecondary }]}>
                            Completa tu perfil profesional
                        </Text>
                    </View>
                    <View style={styles.step}>
                        <Ionicons name="checkmark-circle-outline" size={20} color={colors.primary} />
                        <Text style={[styles.stepText, { color: colors.textSecondary }]}>
                            Verifica tu identidad
                        </Text>
                    </View>
                    <View style={styles.step}>
                        <Ionicons name="checkmark-circle-outline" size={20} color={colors.primary} />
                        <Text style={[styles.stepText, { color: colors.textSecondary }]}>
                            Comienza a recibir casos
                        </Text>
                    </View>
                </View>

                <TouchableOpacity
                    style={[styles.button, { backgroundColor: colors.primary }]}
                    onPress={() => router.push('/')}
                >
                    <Text style={[styles.buttonText, { color: colors.background }]}>
                        Ir al inicio
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.secondaryButton, { borderColor: colors.border }]}
                    onPress={() => router.push('/')}
                >
                    <Text style={[styles.secondaryButtonText, { color: colors.text }]}>
                        Explorar la plataforma
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
        borderRadius: 8,
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
        borderRadius: 12,
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
    },
    button: {
        paddingVertical: Spacing.md,
        paddingHorizontal: Spacing.xl,
        borderRadius: 12,
        width: '100%',
        alignItems: 'center',
        marginBottom: Spacing.md,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 4,
    },
    buttonText: {
        ...Typography.h3,
        fontSize: 18,
        fontWeight: '700',
    },
    secondaryButton: {
        paddingVertical: Spacing.md,
        paddingHorizontal: Spacing.xl,
        borderRadius: 12,
        width: '100%',
        alignItems: 'center',
        borderWidth: 2,
    },
    secondaryButtonText: {
        ...Typography.body,
        fontSize: 16,
        fontWeight: '600',
    },
});
