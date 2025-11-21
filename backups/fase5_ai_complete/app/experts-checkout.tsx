import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TextInput,
    TouchableOpacity,
    useColorScheme,
    ActivityIndicator,
    Alert,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '@/constants/Colors';
import { expertApplicationService } from '@/services/expertApplicationService';

interface PlanDetails {
    id: string;
    name: string;
    price: number;
    features: string[];
}

export default function ExpertsCheckoutScreen() {
    // Always use dark theme
    const colors = Colors.dark;
    const router = useRouter();
    const { plan } = useLocalSearchParams<{ plan?: string }>();

    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        rfc: '',
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isProcessing, setIsProcessing] = useState(false);
    const [planDetails, setPlanDetails] = useState<PlanDetails | null>(null);

    // Validate plan param exists - redirect if missing
    useEffect(() => {
        if (!plan) {
            Alert.alert(
                'Plan no seleccionado',
                'Por favor selecciona un plan antes de continuar.',
                [{ text: 'OK', onPress: () => router.replace('/experts-plans') }]
            );
        }
    }, [plan]);

    // Plan data
    const plans: Record<string, PlanDetails> = {
        basic: {
            id: 'basic',
            name: 'Plan Básico',
            price: 499,
            features: [
                'Hasta 10 casos por mes',
                'Comisión del 20%',
                'Soporte por email',
                'Perfil básico',
            ],
        },
        pro: {
            id: 'pro',
            name: 'Plan Profesional',
            price: 899,
            features: [
                'Casos ilimitados',
                'Comisión del 15%',
                'Soporte prioritario 24/7',
                'Perfil destacado',
                'Badge verificado',
            ],
        },
        enterprise: {
            id: 'enterprise',
            name: 'Plan Enterprise',
            price: 1499,
            features: [
                'Todo lo de Profesional',
                'Comisión del 10%',
                'Asistente personal',
                'Marketing personalizado',
            ],
        },
    };

    useEffect(() => {
        if (plan && plans[plan]) {
            setPlanDetails(plans[plan]);
        }

        // Pre-fill with current lead data if available
        const currentLead = expertApplicationService.getCurrentLead();
        if (currentLead) {
            setFormData({
                fullName: currentLead.fullName || '',
                email: currentLead.email || '',
                phone: currentLead.phone || '',
                rfc: '',
            });
        }
    }, [plan]);

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.fullName.trim()) {
            newErrors.fullName = 'El nombre completo es requerido';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'El email es requerido';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Email inválido';
        }

        if (!formData.phone.trim()) {
            newErrors.phone = 'El teléfono es requerido';
        } else if (!/^\d{12}$/.test(formData.phone.replace(/\s/g, ''))) {
            newErrors.phone = 'Teléfono debe tener 12 dígitos (52 + 10 dígitos)';
        }

        // RFC is optional, but if provided, validate format
        if (formData.rfc && !/^[A-ZÑ&]{3,4}\d{6}[A-Z0-9]{3}$/.test(formData.rfc.toUpperCase())) {
            newErrors.rfc = 'RFC inválido (ej: XAXX010101000)';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handlePayment = async () => {
        if (!validateForm()) {
            return;
        }

        if (!planDetails) {
            Alert.alert('Error', 'No se ha seleccionado un plan válido');
            return;
        }

        setIsProcessing(true);

        try {
            // Simulate payment processing
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Save payment data to current lead
            const currentLead = expertApplicationService.getCurrentLead();
            if (currentLead) {
                // Update lead with payment info (in real app, this would be saved to backend)
                currentLead.fullName = formData.fullName;
                currentLead.email = formData.email;
                currentLead.phone = formData.phone;
            }

            // Navigate to success page
            router.push(`/experts-payment-success?plan=${plan}`);
        } catch (error) {
            Alert.alert(
                'Error',
                'Hubo un problema al procesar el pago. Por favor intenta de nuevo.'
            );
        } finally {
            setIsProcessing(false);
        }
    };

    if (!planDetails) {
        return (
            <View style={[styles.container, { backgroundColor: colors.background }]}>
                <ActivityIndicator size="large" color={colors.primary} />
                <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
                    Cargando información del plan...
                </Text>
            </View>
        );
    }

    return (
        <ScrollView
            style={[styles.container, { backgroundColor: colors.background }]}
            contentContainerStyle={styles.contentContainer}
            showsVerticalScrollIndicator={false}
        >
            {/* Header */}
            <View style={styles.header}>
                <Ionicons name="card" size={48} color={colors.primary} />
                <Text style={[styles.title, { color: colors.text }]}>
                    Finalizar registro
                </Text>
                <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                    Estás a un paso de unirte a Kontify+
                </Text>
            </View>

            {/* Plan Summary */}
            <View style={[styles.planCard, { backgroundColor: colors.cardBackground }]}>
                <View style={styles.planHeader}>
                    <Text style={[styles.planLabel, { color: colors.textSecondary }]}>
                        Plan seleccionado
                    </Text>
                    <View style={[styles.planBadge, { backgroundColor: colors.backgroundElevated, borderColor: colors.primary }]}>
                        <Text style={[styles.planName, { color: colors.primary }]}>
                            {planDetails.name}
                        </Text>
                    </View>
                </View>

                <View style={styles.priceContainer}>
                    <Text style={[styles.currency, { color: colors.text }]}>$</Text>
                    <Text style={[styles.price, { color: colors.text }]}>
                        {planDetails.price}
                    </Text>
                    <Text style={[styles.period, { color: colors.textSecondary }]}>
                        /mes
                    </Text>
                </View>

                <View style={styles.featuresContainer}>
                    <Text style={[styles.featuresTitle, { color: colors.text }]}>
                        Incluye:
                    </Text>
                    {planDetails.features.map((feature, index) => (
                        <View key={index} style={styles.feature}>
                            <Ionicons name="checkmark-circle" size={18} color={colors.primary} />
                            <Text style={[styles.featureText, { color: colors.textSecondary }]}>
                                {feature}
                            </Text>
                        </View>
                    ))}
                </View>
            </View>

            {/* Payment Form */}
            <View style={[styles.formCard, { backgroundColor: colors.cardBackground }]}>
                <Text style={[styles.formTitle, { color: colors.text }]}>
                    Datos de facturación
                </Text>

                {/* Full Name */}
                <View style={styles.inputGroup}>
                    <Text style={[styles.label, { color: colors.text }]}>
                        Nombre completo *
                    </Text>
                    <TextInput
                        style={[
                            styles.input,
                            { backgroundColor: colors.inputBackground, color: colors.text, borderColor: errors.fullName ? '#EF4444' : colors.inputBorder },
                        ]}
                        placeholder="Ej: Juan Pérez García"
                        placeholderTextColor={colors.textTertiary}
                        value={formData.fullName}
                        onChangeText={(text) => {
                            setFormData({ ...formData, fullName: text });
                            if (errors.fullName) setErrors({ ...errors, fullName: '' });
                        }}
                        autoCapitalize="words"
                    />
                    {errors.fullName && (
                        <Text style={styles.errorText}>{errors.fullName}</Text>
                    )}
                </View>

                {/* Email */}
                <View style={styles.inputGroup}>
                    <Text style={[styles.label, { color: colors.text }]}>
                        Email *
                    </Text>
                    <TextInput
                        style={[
                            styles.input,
                            { backgroundColor: colors.inputBackground, color: colors.text, borderColor: errors.email ? '#EF4444' : colors.inputBorder },
                        ]}
                        placeholder="tu@email.com"
                        placeholderTextColor={colors.textTertiary}
                        value={formData.email}
                        onChangeText={(text) => {
                            setFormData({ ...formData, email: text.toLowerCase() });
                            if (errors.email) setErrors({ ...errors, email: '' });
                        }}
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />
                    {errors.email && (
                        <Text style={styles.errorText}>{errors.email}</Text>
                    )}
                </View>

                {/* Phone */}
                <View style={styles.inputGroup}>
                    <Text style={[styles.label, { color: colors.text }]}>
                        Teléfono *
                    </Text>
                    <TextInput
                        style={[
                            styles.input,
                            { backgroundColor: colors.inputBackground, color: colors.text, borderColor: errors.phone ? '#EF4444' : colors.inputBorder },
                        ]}
                        placeholder="524774166291"
                        placeholderTextColor={colors.textTertiary}
                        value={formData.phone}
                        onChangeText={(text) => {
                            setFormData({ ...formData, phone: text.replace(/\D/g, '') });
                            if (errors.phone) setErrors({ ...errors, phone: '' });
                        }}
                        keyboardType="phone-pad"
                        maxLength={12}
                    />
                    {errors.phone && (
                        <Text style={styles.errorText}>{errors.phone}</Text>
                    )}
                </View>

                {/* RFC (Optional) */}
                <View style={styles.inputGroup}>
                    <Text style={[styles.label, { color: colors.text }]}>
                        RFC (opcional)
                    </Text>
                    <TextInput
                        style={[
                            styles.input,
                            { backgroundColor: colors.inputBackground, color: colors.text, borderColor: errors.rfc ? '#EF4444' : colors.inputBorder },
                        ]}
                        placeholder="XAXX010101000"
                        placeholderTextColor={colors.textTertiary}
                        value={formData.rfc}
                        onChangeText={(text) => {
                            setFormData({ ...formData, rfc: text.toUpperCase() });
                            if (errors.rfc) setErrors({ ...errors, rfc: '' });
                        }}
                        autoCapitalize="characters"
                        maxLength={13}
                    />
                    {errors.rfc && (
                        <Text style={styles.errorText}>{errors.rfc}</Text>
                    )}
                </View>
            </View>

            {/* Security Notice */}
            <View style={[styles.securityBox, { backgroundColor: colors.cardBackground }]}>
                <Ionicons name="shield-checkmark" size={24} color={colors.primary} />
                <View style={styles.securityText}>
                    <Text style={[styles.securityTitle, { color: colors.text }]}>
                        Pago seguro
                    </Text>
                    <Text style={[styles.securitySubtitle, { color: colors.textSecondary }]}>
                        Tus datos están protegidos con encriptación SSL
                    </Text>
                </View>
                <Ionicons name="lock-closed" size={20} color={colors.primary} />
            </View>

            {/* Payment Button */}
            <TouchableOpacity
                style={[
                    styles.paymentButton,
                    { backgroundColor: colors.primary },
                    isProcessing && { opacity: 0.6 },
                ]}
                onPress={handlePayment}
                disabled={isProcessing}
            >
                {isProcessing ? (
                    <ActivityIndicator color={colors.background} />
                ) : (
                    <>
                        <Ionicons name="card-outline" size={24} color={colors.background} />
                        <Text style={[styles.paymentButtonText, { color: colors.background }]}>
                            Proceder al pago seguro
                        </Text>
                    </>
                )}
            </TouchableOpacity>

            <Text style={[styles.disclaimer, { color: colors.textTertiary }]}>
                Al continuar, aceptas nuestros términos y condiciones. Puedes cancelar tu suscripción en cualquier momento.
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
        marginTop: Spacing.md,
        marginBottom: Spacing.xs,
        textAlign: 'center',
    },
    subtitle: {
        ...Typography.body,
        fontSize: 16,
        textAlign: 'center',
    },
    loadingText: {
        ...Typography.body,
        fontSize: 16,
        marginTop: Spacing.md,
    },
    planCard: {
        padding: Spacing.lg,
        borderRadius: 12,
        marginBottom: Spacing.lg,
    },
    planHeader: {
        marginBottom: Spacing.md,
    },
    planLabel: {
        ...Typography.caption,
        fontSize: 12,
        marginBottom: Spacing.xs,
        textTransform: 'uppercase',
    },
    planBadge: {
        paddingVertical: Spacing.xs,
        paddingHorizontal: Spacing.md,
        borderRadius: BorderRadius.md,
        borderWidth: 2,
        alignSelf: 'flex-start',
    },
    planName: {
        ...Typography.h3,
        fontSize: 18,
        fontWeight: '600',
    },
    priceContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: Spacing.md,
    },
    currency: {
        ...Typography.h3,
        fontSize: 20,
        fontWeight: '600',
        marginTop: 2,
    },
    price: {
        ...Typography.h1,
        fontSize: 36,
        fontWeight: '700',
    },
    period: {
        ...Typography.body,
        fontSize: 14,
        marginTop: 6,
    },
    featuresContainer: {
        marginTop: Spacing.sm,
    },
    featuresTitle: {
        ...Typography.body,
        fontSize: 14,
        fontWeight: '600',
        marginBottom: Spacing.xs,
    },
    feature: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: Spacing.xs,
    },
    featureText: {
        ...Typography.body,
        fontSize: 14,
        marginLeft: Spacing.xs,
    },
    formCard: {
        padding: Spacing.lg,
        borderRadius: 12,
        marginBottom: Spacing.lg,
    },
    formTitle: {
        ...Typography.h3,
        fontSize: 18,
        fontWeight: '600',
        marginBottom: Spacing.md,
    },
    inputGroup: {
        marginBottom: Spacing.md,
    },
    label: {
        ...Typography.body,
        fontSize: 15,
        fontWeight: '600',
        marginBottom: Spacing.xs,
    },
    input: {
        ...Typography.body,
        fontSize: 16,
        paddingVertical: Spacing.md,
        paddingHorizontal: Spacing.md,
        borderRadius: 8,
        borderWidth: 1,
    },
    errorText: {
        ...Typography.caption,
        fontSize: 13,
        color: '#EF4444',
        marginTop: Spacing.xs,
    },
    securityBox: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: Spacing.md,
        borderRadius: 8,
        marginBottom: Spacing.lg,
    },
    securityText: {
        flex: 1,
        marginLeft: Spacing.sm,
    },
    securityTitle: {
        ...Typography.body,
        fontSize: 14,
        fontWeight: '600',
    },
    securitySubtitle: {
        ...Typography.caption,
        fontSize: 12,
    },
    paymentButton: {
        flexDirection: 'row',
        paddingVertical: Spacing.md + 2,
        paddingHorizontal: Spacing.lg,
        borderRadius: BorderRadius.lg,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: Spacing.md,
        ...Shadows.green,
    },
    paymentButtonText: {
        ...Typography.h3,
        fontSize: 18,
        fontWeight: '700',
        marginLeft: Spacing.sm,
    },
    disclaimer: {
        ...Typography.caption,
        fontSize: 12,
        textAlign: 'center',
        lineHeight: 18,
    },
});

