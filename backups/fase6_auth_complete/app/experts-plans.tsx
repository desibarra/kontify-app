import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    useColorScheme,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '@/constants/Colors';
import { expertApplicationService } from '@/services/expertApplicationService';

interface Plan {
    id: string;
    name: string;
    price: number;
    period: 'monthly' | 'annual';
    recommended?: boolean;
    features: string[];
    commission: number;
}

export default function ExpertPlansScreen() {
    // Always use dark theme
    const colors = Colors.dark;
    const router = useRouter();

    const [selectedPlan, setSelectedPlan] = useState<string>('pro');

    const plans: Plan[] = [
        {
            id: 'basic',
            name: 'Básico',
            price: 499,
            period: 'monthly',
            commission: 20,
            features: [
                'Hasta 10 casos por mes',
                'Comisión del 20%',
                'Soporte por email',
                'Perfil básico',
                'Pago semanal',
            ],
        },
        {
            id: 'pro',
            name: 'Profesional',
            price: 899,
            period: 'monthly',
            recommended: true,
            commission: 15,
            features: [
                'Casos ilimitados',
                'Comisión del 15%',
                'Soporte prioritario 24/7',
                'Perfil destacado',
                'Pago inmediato',
                'Acceso a webinars exclusivos',
                'Badge de "Experto Verificado"',
            ],
        },
        {
            id: 'enterprise',
            name: 'Enterprise',
            price: 1499,
            period: 'monthly',
            commission: 10,
            features: [
                'Todo lo de Profesional',
                'Comisión del 10%',
                'Asistente personal dedicado',
                'Prioridad en asignación de casos',
                'Marketing personalizado',
                'Análisis de desempeño avanzado',
                'Networking con empresas',
            ],
        },
    ];

    const handleSelectPlan = (planId: string) => {
        setSelectedPlan(planId);
    };

    const handleContinue = () => {
        // Save selected plan to service
        expertApplicationService.setSelectedPlan(selectedPlan);

        // Navigate to checkout with plan parameter
        router.push(`/experts-checkout?plan=${selectedPlan}`);
    };

    return (
        <ScrollView
            style={[styles.container, { backgroundColor: colors.backgroundSecondary }]}
            contentContainerStyle={styles.contentContainer}
            showsVerticalScrollIndicator={false}
        >
            <View style={styles.header}>
                <Text style={[styles.title, { color: colors.text }]}>
                    Elige tu plan ideal
                </Text>
                <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                    Todos los planes incluyen acceso completo a la plataforma
                </Text>
            </View>

            <View style={styles.plansContainer}>
                {plans.map((plan) => (
                    <TouchableOpacity
                        key={plan.id}
                        style={[
                            styles.planCard,
                            { backgroundColor: colors.cardBackground, borderColor: colors.border },
                            selectedPlan === plan.id && {
                                borderColor: colors.primary,
                                borderWidth: 3,
                            },
                            plan.recommended && styles.recommendedCard,
                            Shadows.md,
                        ]}
                        onPress={() => handleSelectPlan(plan.id)}
                    >
                        {plan.recommended && (
                            <View style={[styles.recommendedBadge, { backgroundColor: colors.primary }]}>
                                <Text style={[styles.recommendedText, { color: colors.background }]}>
                                    ⭐ Más popular
                                </Text>
                            </View>
                        )}

                        <Text style={[styles.planName, { color: colors.text }]}>
                            {plan.name}
                        </Text>

                        <View style={styles.priceContainer}>
                            <Text style={[styles.currency, { color: colors.text }]}>$</Text>
                            <Text style={[styles.price, { color: colors.text }]}>
                                {plan.price}
                            </Text>
                            <Text style={[styles.period, { color: colors.textSecondary }]}>
                                /mes
                            </Text>
                        </View>

                        <View style={[styles.commissionBox, { backgroundColor: colors.backgroundElevated, borderColor: colors.primary }]}>
                            <Text style={[styles.commissionText, { color: colors.primary }]}>
                                Solo {plan.commission}% de comisión
                            </Text>
                        </View>

                        <View style={styles.featuresContainer}>
                            {plan.features.map((feature, index) => (
                                <View key={index} style={styles.feature}>
                                    <Ionicons name="checkmark-circle" size={20} color={colors.primary} />
                                    <Text style={[styles.featureText, { color: colors.text }]}>
                                        {feature}
                                    </Text>
                                </View>
                            ))}
                        </View>

                        {selectedPlan === plan.id && (
                            <View style={[styles.selectedIndicator, { backgroundColor: colors.primary }]}>
                                <Ionicons name="checkmark-circle" size={24} color={colors.background} />
                                <Text style={[styles.selectedText, { color: colors.background }]}>
                                    Seleccionado
                                </Text>
                            </View>
                        )}
                    </TouchableOpacity>
                ))}
            </View>

            <View style={[styles.guaranteeBox, { backgroundColor: colors.cardBackground }]}>
                <Ionicons name="shield-checkmark" size={32} color={colors.primary} />
                <Text style={[styles.guaranteeTitle, { color: colors.text }]}>
                    Garantía de 30 días
                </Text>
                <Text style={[styles.guaranteeText, { color: colors.textSecondary }]}>
                    Si no estás satisfecho, te devolvemos el 100% de tu inversión
                </Text>
            </View>

            <TouchableOpacity
                style={[styles.continueButton, { backgroundColor: colors.primary }, Shadows.green]}
                onPress={handleContinue}
                activeOpacity={0.9}
            >
                <Text style={[styles.continueText, { color: colors.background }]}>
                    Continuar
                </Text>
                <Ionicons name="arrow-forward" size={24} color={colors.background} />
            </TouchableOpacity>

            <Text style={[styles.disclaimer, { color: colors.textTertiary }]}>
                Puedes cambiar o cancelar tu plan en cualquier momento
            </Text>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    contentContainer: {
        padding: Spacing.lg,
        paddingBottom: Spacing.xxl,
    },
    header: {
        alignItems: 'center',
        marginBottom: Spacing.xl,
        paddingTop: Spacing.lg,
    },
    title: {
        ...Typography.h2,
        fontSize: 28,
        fontWeight: '700',
        marginBottom: Spacing.xs,
        textAlign: 'center',
    },
    subtitle: {
        ...Typography.body,
        fontSize: 16,
        textAlign: 'center',
    },
    plansContainer: {
        marginBottom: Spacing.xl,
    },
    planCard: {
        padding: Spacing.lg,
        borderRadius: BorderRadius.lg,
        borderWidth: 2,
        marginBottom: Spacing.lg,
        position: 'relative',
    },
    recommendedCard: {
        transform: [{ scale: 1.02 }],
    },
    recommendedBadge: {
        position: 'absolute',
        top: -12,
        alignSelf: 'center',
        paddingVertical: Spacing.xs,
        paddingHorizontal: Spacing.md,
        borderRadius: 20,
    },
    recommendedText: {
        ...Typography.caption,
        fontSize: 12,
        fontWeight: '700',
    },
    planName: {
        ...Typography.h2,
        fontSize: 24,
        fontWeight: '700',
        marginBottom: Spacing.sm,
        textAlign: 'center',
    },
    priceContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'center',
        marginBottom: Spacing.md,
    },
    currency: {
        ...Typography.h3,
        fontSize: 24,
        fontWeight: '600',
        marginTop: 4,
    },
    price: {
        ...Typography.h1,
        fontSize: 48,
        fontWeight: '700',
    },
    period: {
        ...Typography.body,
        fontSize: 16,
        marginTop: 8,
    },
    commissionBox: {
        padding: Spacing.sm,
        borderRadius: BorderRadius.md,
        borderWidth: 1,
        alignItems: 'center',
        marginBottom: Spacing.md,
    },
    commissionText: {
        ...Typography.body,
        fontSize: 15,
        fontWeight: '600',
    },
    featuresContainer: {
        marginTop: Spacing.md,
    },
    feature: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: Spacing.sm,
    },
    featureText: {
        ...Typography.body,
        fontSize: 15,
        marginLeft: Spacing.sm,
        flex: 1,
    },
    selectedIndicator: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: Spacing.sm,
        borderRadius: 8,
        marginTop: Spacing.md,
    },
    selectedText: {
        ...Typography.body,
        fontSize: 15,
        fontWeight: '600',
        marginLeft: Spacing.xs,
    },
    guaranteeBox: {
        padding: Spacing.lg,
        borderRadius: 12,
        alignItems: 'center',
        marginBottom: Spacing.xl,
    },
    guaranteeTitle: {
        ...Typography.h3,
        fontSize: 18,
        fontWeight: '600',
        marginTop: Spacing.sm,
        marginBottom: Spacing.xs,
    },
    guaranteeText: {
        ...Typography.body,
        fontSize: 14,
        textAlign: 'center',
    },
    continueButton: {
        flexDirection: 'row',
        paddingVertical: Spacing.md + 2,
        paddingHorizontal: Spacing.lg,
        borderRadius: BorderRadius.lg,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: Spacing.md,
    },
    continueText: {
        ...Typography.h3,
        fontSize: 18,
        fontWeight: '700',
        marginRight: Spacing.sm,
    },
    disclaimer: {
        ...Typography.caption,
        fontSize: 13,
        textAlign: 'center',
    },
});

