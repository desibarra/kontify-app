import React, { useState } from 'react';
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
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../constants/Colors';

export default function ExpertRegisterScreen() {
    // Always use dark theme
    const colors = Colors.dark;
    const router = useRouter();

    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        specialty: '',
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const specialties = [
        'Contador Público',
        'Fiscalista',
        'Abogado Fiscal',
        'Auditor',
        'Consultor Fiscal',
        'Otro',
    ];

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

        if (!formData.specialty) {
            newErrors.specialty = 'Selecciona tu especialidad';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);

        try {
            await new Promise(resolve => setTimeout(resolve, 1500));
            router.push('/experts-plans');
        } catch (error) {
            Alert.alert(
                'Error',
                'Hubo un problema al enviar tu registro. Por favor intenta de nuevo.'
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <ScrollView
            style={[styles.container, { backgroundColor: colors.background }]}
            contentContainerStyle={styles.contentContainer}
            showsVerticalScrollIndicator={false}
        >
            <View style={styles.header}>
                <Ionicons name="rocket" size={48} color={colors.primary} />
                <Text style={[styles.title, { color: colors.text }]}>
                    ¡Estás a un paso de transformar tu práctica!
                </Text>
                <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                    Completa este formulario en 30 segundos
                </Text>
            </View>

            <View style={[styles.formCard, { backgroundColor: colors.cardBackground, borderColor: colors.border }, Shadows.md]}>
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

                <View style={styles.inputGroup}>
                    <Text style={[styles.label, { color: colors.text }]}>
                        Email profesional *
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

                <View style={styles.inputGroup}>
                    <Text style={[styles.label, { color: colors.text }]}>
                        Teléfono / WhatsApp *
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

                <View style={styles.inputGroup}>
                    <Text style={[styles.label, { color: colors.text }]}>
                        Especialidad principal *
                    </Text>
                    <View style={styles.specialtiesGrid}>
                        {specialties.map((specialty) => (
                            <TouchableOpacity
                                key={specialty}
                                style={[
                                    styles.specialtyChip,
                                    { borderColor: colors.border },
                                    formData.specialty === specialty && {
                                        backgroundColor: colors.primary,
                                        borderColor: colors.primary,
                                    },
                                ]}
                                onPress={() => {
                                    setFormData({ ...formData, specialty });
                                    if (errors.specialty) setErrors({ ...errors, specialty: '' });
                                }}
                            >
                                <Text
                                    style={[
                                        styles.specialtyText,
                                        { color: colors.text },
                                        formData.specialty === specialty && { color: colors.background },
                                    ]}
                                >
                                    {specialty}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                    {errors.specialty && (
                        <Text style={styles.errorText}>{errors.specialty}</Text>
                    )}
                </View>

                <TouchableOpacity
                    style={[
                        styles.submitButton,
                        { backgroundColor: colors.primary },
                        isSubmitting && { opacity: 0.6 },
                    ]}
                    onPress={handleSubmit}
                    disabled={isSubmitting}
                >
                    {isSubmitting ? (
                        <ActivityIndicator color={colors.background} />
                    ) : (
                        <>
                            <Text style={[styles.submitText, { color: colors.background }]}>
                                Continuar a planes
                            </Text>
                            <Ionicons name="arrow-forward" size={24} color={colors.background} />
                        </>
                    )}
                </TouchableOpacity>

                <Text style={[styles.disclaimer, { color: colors.textTertiary }]}>
                    Al continuar, aceptas nuestros términos y condiciones. No compartimos tu información.
                </Text>
            </View>

            <View style={styles.trustSignals}>
                <View style={styles.trustItem}>
                    <Ionicons name="shield-checkmark" size={20} color={colors.primary} />
                    <Text style={[styles.trustText, { color: colors.textSecondary }]}>
                        Datos protegidos
                    </Text>
                </View>
                <View style={styles.trustItem}>
                    <Ionicons name="time" size={20} color={colors.primary} />
                    <Text style={[styles.trustText, { color: colors.textSecondary }]}>
                        Proceso rápido
                    </Text>
                </View>
                <View style={styles.trustItem}>
                    <Ionicons name="close-circle" size={20} color={colors.primary} />
                    <Text style={[styles.trustText, { color: colors.textSecondary }]}>
                        Sin compromiso
                    </Text>
                </View>
            </View>
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
        fontSize: 24,
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
    formCard: {
        padding: Spacing.lg,
        borderRadius: BorderRadius.lg,
        borderWidth: 1,
        marginBottom: Spacing.lg,
    },
    inputGroup: {
        marginBottom: Spacing.lg,
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
        borderRadius: BorderRadius.md,
        borderWidth: 1,
    },
    errorText: {
        ...Typography.caption,
        fontSize: 13,
        color: '#EF4444',
        marginTop: Spacing.xs,
    },
    specialtiesGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: Spacing.sm,
    },
    specialtyChip: {
        paddingVertical: Spacing.sm,
        paddingHorizontal: Spacing.md,
        borderRadius: 20,
        borderWidth: 1,
    },
    specialtyText: {
        ...Typography.body,
        fontSize: 14,
        fontWeight: '500',
    },
    submitButton: {
        flexDirection: 'row',
        paddingVertical: Spacing.md + 2,
        paddingHorizontal: Spacing.lg,
        borderRadius: BorderRadius.lg,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: Spacing.md,
        ...Shadows.green,
    },
    submitText: {
        ...Typography.h3,
        fontSize: 18,
        fontWeight: '700',
        marginRight: Spacing.sm,
    },
    disclaimer: {
        ...Typography.caption,
        fontSize: 12,
        textAlign: 'center',
        marginTop: Spacing.md,
        lineHeight: 18,
    },
    trustSignals: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: Spacing.lg,
    },
    trustItem: {
        alignItems: 'center',
    },
    trustText: {
        ...Typography.caption,
        fontSize: 12,
        marginTop: Spacing.xs,
    },
});
