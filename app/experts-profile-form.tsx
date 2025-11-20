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
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing } from '../constants/Colors';
import { expertApplicationService } from '../services/expertApplicationService';

const SPECIALIZATIONS = [
    'Contabilidad General',
    'Auditoría',
    'Fiscal',
    'Finanzas Corporativas',
    'Nóminas',
    'Derecho Fiscal',
    'Consultoría',
    'Otro',
];

const SERVICES = [
    'Declaraciones mensuales',
    'Declaración anual',
    'Auditorías',
    'Planeación fiscal',
    'Defensa fiscal',
    'Asesoría legal',
    'Constitución de empresas',
    'Contabilidad electrónica',
];

const STATES = [
    'Aguascalientes', 'Baja California', 'Baja California Sur', 'Campeche',
    'Chiapas', 'Chihuahua', 'Ciudad de México', 'Coahuila', 'Colima',
    'Durango', 'Guanajuato', 'Guerrero', 'Hidalgo', 'Jalisco', 'México',
    'Michoacán', 'Morelos', 'Nayarit', 'Nuevo León', 'Oaxaca', 'Puebla',
    'Querétaro', 'Quintana Roo', 'San Luis Potosí', 'Sinaloa', 'Sonora',
    'Tabasco', 'Tamaulipas', 'Tlaxcala', 'Veracruz', 'Yucatán', 'Zacatecas',
];

export default function ExpertsProfileFormScreen() {
    const colorScheme = useColorScheme();
    const colors = colorScheme === 'dark' ? Colors.dark : Colors.light;
    const router = useRouter();

    const [formData, setFormData] = useState({
        cedula: '',
        yearsOfExperience: '',
        specializations: [] as string[],
        services: [] as string[],
        bio: '',
        city: '',
        state: '',
        website: '',
        linkedin: '',
        facebookPage: '',
        rfc: '',
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        // Pre-fill with existing profile data if available
        const profile = expertApplicationService.getProfessionalProfile();
        if (profile) {
            setFormData({
                cedula: profile.cedula || '',
                yearsOfExperience: profile.yearsOfExperience?.toString() || '',
                specializations: profile.specializations || [],
                services: profile.services || [],
                bio: profile.bio || '',
                city: profile.city || '',
                state: profile.state || '',
                website: profile.website || '',
                linkedin: profile.linkedin || '',
                facebookPage: profile.facebookPage || '',
                rfc: profile.rfc || '',
            });
        }
    }, []);

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        // Cédula profesional: 7-10 dígitos
        if (!formData.cedula.trim()) {
            newErrors.cedula = 'La cédula profesional es requerida';
        } else if (!/^\d{7,10}$/.test(formData.cedula)) {
            newErrors.cedula = 'Cédula debe tener entre 7 y 10 dígitos';
        }

        // Años de experiencia: mínimo 1
        const years = parseInt(formData.yearsOfExperience);
        if (!formData.yearsOfExperience) {
            newErrors.yearsOfExperience = 'Los años de experiencia son requeridos';
        } else if (isNaN(years) || years < 1) {
            newErrors.yearsOfExperience = 'Debe tener al menos 1 año de experiencia';
        }

        // Especialidades: mínimo 1
        if (formData.specializations.length === 0) {
            newErrors.specializations = 'Selecciona al menos una especialidad';
        }

        // Servicios: mínimo 1
        if (formData.services.length === 0) {
            newErrors.services = 'Selecciona al menos un servicio';
        }

        // Biografía: mínimo 50 caracteres
        if (!formData.bio.trim()) {
            newErrors.bio = 'La biografía es requerida';
        } else if (formData.bio.trim().length < 50) {
            newErrors.bio = `Mínimo 50 caracteres (actual: ${formData.bio.trim().length})`;
        }

        // Ciudad: obligatorio
        if (!formData.city.trim()) {
            newErrors.city = 'La ciudad es requerida';
        }

        // Estado: obligatorio
        if (!formData.state) {
            newErrors.state = 'El estado es requerido';
        }

        // Website (opcional, pero si se proporciona, validar formato)
        if (formData.website && !/^https?:\/\/.+/.test(formData.website)) {
            newErrors.website = 'URL inválida (debe iniciar con http:// o https://)';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const toggleSelection = (field: 'specializations' | 'services', value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: prev[field].includes(value)
                ? prev[field].filter(item => item !== value)
                : [...prev[field], value],
        }));
        if (errors[field]) {
            setErrors({ ...errors, [field]: '' });
        }
    };

    const handleSubmit = async () => {
        if (!validateForm()) {
            Alert.alert('Error', 'Por favor corrige los errores en el formulario');
            return;
        }

        setIsSubmitting(true);

        try {
            // Save professional profile data
            await expertApplicationService.updateProfessionalProfile({
                cedula: formData.cedula,
                yearsOfExperience: parseInt(formData.yearsOfExperience),
                specializations: formData.specializations,
                services: formData.services,
                bio: formData.bio,
                city: formData.city,
                state: formData.state,
                website: formData.website || undefined,
                linkedin: formData.linkedin || undefined,
                facebookPage: formData.facebookPage || undefined,
                rfc: formData.rfc || undefined,
            });

            // Navigate to onboarding (or placeholder)
            router.push('/experts-onboarding');
        } catch (error) {
            Alert.alert(
                'Error',
                'Hubo un problema al guardar tu perfil. Por favor intenta de nuevo.'
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
            {/* Progress Bar */}
            <View style={styles.progressContainer}>
                <Text style={[styles.progressText, { color: colors.textSecondary }]}>
                    Paso 3 de 4
                </Text>
                <View style={[styles.progressBar, { backgroundColor: colors.border }]}>
                    <View
                        style={[
                            styles.progressFill,
                            { backgroundColor: colors.primary, width: '75%' },
                        ]}
                    />
                </View>
            </View>

            {/* Header */}
            <View style={styles.header}>
                <Ionicons name="document-text" size={48} color={colors.primary} />
                <Text style={[styles.title, { color: colors.text }]}>
                    Completa tu Perfil Profesional
                </Text>
                <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                    Esta información ayuda a que los clientes te elijan con confianza
                </Text>
            </View>

            {/* Form */}
            <View style={[styles.formCard, { backgroundColor: colors.cardBackground }]}>
                {/* Cédula Profesional */}
                <View style={styles.inputGroup}>
                    <Text style={[styles.label, { color: colors.text }]}>
                        Cédula Profesional *
                    </Text>
                    <TextInput
                        style={[
                            styles.input,
                            {
                                backgroundColor: colors.background,
                                color: colors.text,
                                borderColor: errors.cedula ? '#EF4444' : colors.border,
                            },
                        ]}
                        placeholder="1234567"
                        placeholderTextColor={colors.textTertiary}
                        value={formData.cedula}
                        onChangeText={(text) => {
                            setFormData({ ...formData, cedula: text.replace(/\D/g, '') });
                            if (errors.cedula) setErrors({ ...errors, cedula: '' });
                        }}
                        keyboardType="number-pad"
                        maxLength={10}
                    />
                    {errors.cedula && <Text style={styles.errorText}>{errors.cedula}</Text>}
                </View>

                {/* Años de Experiencia */}
                <View style={styles.inputGroup}>
                    <Text style={[styles.label, { color: colors.text }]}>
                        Años de Experiencia *
                    </Text>
                    <TextInput
                        style={[
                            styles.input,
                            {
                                backgroundColor: colors.background,
                                color: colors.text,
                                borderColor: errors.yearsOfExperience ? '#EF4444' : colors.border,
                            },
                        ]}
                        placeholder="5"
                        placeholderTextColor={colors.textTertiary}
                        value={formData.yearsOfExperience}
                        onChangeText={(text) => {
                            setFormData({ ...formData, yearsOfExperience: text.replace(/\D/g, '') });
                            if (errors.yearsOfExperience) setErrors({ ...errors, yearsOfExperience: '' });
                        }}
                        keyboardType="number-pad"
                        maxLength={2}
                    />
                    {errors.yearsOfExperience && (
                        <Text style={styles.errorText}>{errors.yearsOfExperience}</Text>
                    )}
                </View>

                {/* Especialidades */}
                <View style={styles.inputGroup}>
                    <Text style={[styles.label, { color: colors.text }]}>
                        Especialidades * (selecciona al menos 1)
                    </Text>
                    <View style={styles.chipsContainer}>
                        {SPECIALIZATIONS.map((spec) => (
                            <TouchableOpacity
                                key={spec}
                                style={[
                                    styles.chip,
                                    { borderColor: colors.border },
                                    formData.specializations.includes(spec) && {
                                        backgroundColor: colors.primary,
                                        borderColor: colors.primary,
                                    },
                                ]}
                                onPress={() => toggleSelection('specializations', spec)}
                            >
                                <Text
                                    style={[
                                        styles.chipText,
                                        { color: colors.text },
                                        formData.specializations.includes(spec) && {
                                            color: colors.background,
                                        },
                                    ]}
                                >
                                    {spec}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                    {errors.specializations && (
                        <Text style={styles.errorText}>{errors.specializations}</Text>
                    )}
                </View>

                {/* Servicios */}
                <View style={styles.inputGroup}>
                    <Text style={[styles.label, { color: colors.text }]}>
                        Servicios que Ofreces * (selecciona al menos 1)
                    </Text>
                    <View style={styles.chipsContainer}>
                        {SERVICES.map((service) => (
                            <TouchableOpacity
                                key={service}
                                style={[
                                    styles.chip,
                                    { borderColor: colors.border },
                                    formData.services.includes(service) && {
                                        backgroundColor: colors.primary,
                                        borderColor: colors.primary,
                                    },
                                ]}
                                onPress={() => toggleSelection('services', service)}
                            >
                                <Text
                                    style={[
                                        styles.chipText,
                                        { color: colors.text },
                                        formData.services.includes(service) && {
                                            color: colors.background,
                                        },
                                    ]}
                                >
                                    {service}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                    {errors.services && <Text style={styles.errorText}>{errors.services}</Text>}
                </View>

                {/* Biografía */}
                <View style={styles.inputGroup}>
                    <Text style={[styles.label, { color: colors.text }]}>
                        Biografía Profesional * (mínimo 50 caracteres)
                    </Text>
                    <TextInput
                        style={[
                            styles.textArea,
                            {
                                backgroundColor: colors.background,
                                color: colors.text,
                                borderColor: errors.bio ? '#EF4444' : colors.border,
                            },
                        ]}
                        placeholder="Describe tu experiencia, logros y enfoque profesional..."
                        placeholderTextColor={colors.textTertiary}
                        value={formData.bio}
                        onChangeText={(text) => {
                            setFormData({ ...formData, bio: text });
                            if (errors.bio) setErrors({ ...errors, bio: '' });
                        }}
                        multiline
                        numberOfLines={6}
                        textAlignVertical="top"
                    />
                    <Text style={[styles.charCount, { color: colors.textTertiary }]}>
                        {formData.bio.length} caracteres
                    </Text>
                    {errors.bio && <Text style={styles.errorText}>{errors.bio}</Text>}
                </View>

                {/* Ciudad */}
                <View style={styles.inputGroup}>
                    <Text style={[styles.label, { color: colors.text }]}>Ciudad *</Text>
                    <TextInput
                        style={[
                            styles.input,
                            {
                                backgroundColor: colors.background,
                                color: colors.text,
                                borderColor: errors.city ? '#EF4444' : colors.border,
                            },
                        ]}
                        placeholder="Ej: Monterrey"
                        placeholderTextColor={colors.textTertiary}
                        value={formData.city}
                        onChangeText={(text) => {
                            setFormData({ ...formData, city: text });
                            if (errors.city) setErrors({ ...errors, city: '' });
                        }}
                        autoCapitalize="words"
                    />
                    {errors.city && <Text style={styles.errorText}>{errors.city}</Text>}
                </View>

                {/* Estado */}
                <View style={styles.inputGroup}>
                    <Text style={[styles.label, { color: colors.text }]}>Estado *</Text>
                    <View style={styles.chipsContainer}>
                        {STATES.map((state) => (
                            <TouchableOpacity
                                key={state}
                                style={[
                                    styles.chip,
                                    { borderColor: colors.border },
                                    formData.state === state && {
                                        backgroundColor: colors.primary,
                                        borderColor: colors.primary,
                                    },
                                ]}
                                onPress={() => {
                                    setFormData({ ...formData, state });
                                    if (errors.state) setErrors({ ...errors, state: '' });
                                }}
                            >
                                <Text
                                    style={[
                                        styles.chipText,
                                        { color: colors.text },
                                        formData.state === state && { color: colors.background },
                                    ]}
                                >
                                    {state}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                    {errors.state && <Text style={styles.errorText}>{errors.state}</Text>}
                </View>

                {/* Optional Fields */}
                <Text style={[styles.sectionTitle, { color: colors.text }]}>
                    Información Opcional
                </Text>

                {/* Website */}
                <View style={styles.inputGroup}>
                    <Text style={[styles.label, { color: colors.text }]}>
                        Página Web (opcional)
                    </Text>
                    <TextInput
                        style={[
                            styles.input,
                            {
                                backgroundColor: colors.background,
                                color: colors.text,
                                borderColor: errors.website ? '#EF4444' : colors.border,
                            },
                        ]}
                        placeholder="https://mipagina.com"
                        placeholderTextColor={colors.textTertiary}
                        value={formData.website}
                        onChangeText={(text) => {
                            setFormData({ ...formData, website: text });
                            if (errors.website) setErrors({ ...errors, website: '' });
                        }}
                        keyboardType="url"
                        autoCapitalize="none"
                    />
                    {errors.website && <Text style={styles.errorText}>{errors.website}</Text>}
                </View>

                {/* LinkedIn */}
                <View style={styles.inputGroup}>
                    <Text style={[styles.label, { color: colors.text }]}>
                        LinkedIn (opcional)
                    </Text>
                    <TextInput
                        style={[
                            styles.input,
                            { backgroundColor: colors.background, color: colors.text, borderColor: colors.border },
                        ]}
                        placeholder="https://linkedin.com/in/tu-perfil"
                        placeholderTextColor={colors.textTertiary}
                        value={formData.linkedin}
                        onChangeText={(text) => setFormData({ ...formData, linkedin: text })}
                        keyboardType="url"
                        autoCapitalize="none"
                    />
                </View>

                {/* Facebook Page */}
                <View style={styles.inputGroup}>
                    <Text style={[styles.label, { color: colors.text }]}>
                        Página de Facebook (opcional)
                    </Text>
                    <TextInput
                        style={[
                            styles.input,
                            { backgroundColor: colors.background, color: colors.text, borderColor: colors.border },
                        ]}
                        placeholder="https://facebook.com/tu-pagina"
                        placeholderTextColor={colors.textTertiary}
                        value={formData.facebookPage}
                        onChangeText={(text) => setFormData({ ...formData, facebookPage: text })}
                        keyboardType="url"
                        autoCapitalize="none"
                    />
                </View>

                {/* RFC */}
                <View style={styles.inputGroup}>
                    <Text style={[styles.label, { color: colors.text }]}>RFC (opcional)</Text>
                    <TextInput
                        style={[
                            styles.input,
                            { backgroundColor: colors.background, color: colors.text, borderColor: colors.border },
                        ]}
                        placeholder="XAXX010101000"
                        placeholderTextColor={colors.textTertiary}
                        value={formData.rfc}
                        onChangeText={(text) => setFormData({ ...formData, rfc: text.toUpperCase() })}
                        autoCapitalize="characters"
                        maxLength={13}
                    />
                </View>
            </View>

            {/* Submit Button */}
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
                            Guardar y continuar
                        </Text>
                        <Ionicons name="arrow-forward" size={24} color={colors.background} />
                    </>
                )}
            </TouchableOpacity>

            <Text style={[styles.disclaimer, { color: colors.textTertiary }]}>
                Toda la información será verificada antes de activar tu perfil
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
    progressContainer: {
        marginBottom: Spacing.lg,
    },
    progressText: {
        ...Typography.caption,
        fontSize: 12,
        marginBottom: Spacing.xs,
        textAlign: 'center',
    },
    progressBar: {
        height: 6,
        borderRadius: 3,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        borderRadius: 3,
    },
    header: {
        alignItems: 'center',
        marginBottom: Spacing.xl,
    },
    title: {
        ...Typography.h2,
        fontSize: 26,
        fontWeight: '700',
        marginTop: Spacing.md,
        marginBottom: Spacing.xs,
        textAlign: 'center',
    },
    subtitle: {
        ...Typography.body,
        fontSize: 15,
        textAlign: 'center',
        lineHeight: 22,
    },
    formCard: {
        padding: Spacing.lg,
        borderRadius: 12,
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
        borderRadius: 8,
        borderWidth: 1,
    },
    textArea: {
        ...Typography.body,
        fontSize: 16,
        paddingVertical: Spacing.md,
        paddingHorizontal: Spacing.md,
        borderRadius: 8,
        borderWidth: 1,
        minHeight: 120,
    },
    charCount: {
        ...Typography.caption,
        fontSize: 12,
        marginTop: Spacing.xs,
        textAlign: 'right',
    },
    chipsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: Spacing.sm,
    },
    chip: {
        paddingVertical: Spacing.sm,
        paddingHorizontal: Spacing.md,
        borderRadius: 20,
        borderWidth: 1,
        marginBottom: Spacing.xs,
    },
    chipText: {
        ...Typography.body,
        fontSize: 14,
        fontWeight: '500',
    },
    errorText: {
        ...Typography.caption,
        fontSize: 13,
        color: '#EF4444',
        marginTop: Spacing.xs,
    },
    sectionTitle: {
        ...Typography.h3,
        fontSize: 18,
        fontWeight: '600',
        marginTop: Spacing.md,
        marginBottom: Spacing.md,
    },
    submitButton: {
        flexDirection: 'row',
        paddingVertical: Spacing.md,
        paddingHorizontal: Spacing.lg,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: Spacing.md,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
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
        lineHeight: 18,
    },
});
