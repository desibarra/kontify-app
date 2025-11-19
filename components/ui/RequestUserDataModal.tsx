import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Modal,
    TextInput,
    TouchableOpacity,
    useColorScheme,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, BorderRadius, Typography } from '../../constants/Colors';
import { UserContactData } from '../../constants/Types';

interface RequestUserDataModalProps {
    visible: boolean;
    onClose: () => void;
    onSubmit: (data: UserContactData) => void;
    caseLevel?: 'green' | 'yellow' | 'red';
}

export default function RequestUserDataModal({
    visible,
    onClose,
    onSubmit,
    caseLevel = 'green',
}: RequestUserDataModalProps) {
    const colorScheme = useColorScheme();
    const colors = colorScheme === 'dark' ? Colors.dark : Colors.light;

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [whatsapp, setWhatsapp] = useState('');
    const [errors, setErrors] = useState<{ name?: string; email?: string; whatsapp?: string }>({});

    const validate = (): boolean => {
        const newErrors: { name?: string; email?: string; whatsapp?: string } = {};

        if (!name.trim()) {
            newErrors.name = 'El nombre es requerido';
        }

        if (!email.trim()) {
            newErrors.email = 'El correo es requerido';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            newErrors.email = 'Correo inválido';
        }

        if (!whatsapp.trim()) {
            newErrors.whatsapp = 'El WhatsApp es requerido';
        } else if (!/^\+?[0-9]{10,15}$/.test(whatsapp.replace(/\s/g, ''))) {
            newErrors.whatsapp = 'Número inválido (10-15 dígitos)';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = () => {
        if (validate()) {
            onSubmit({ name: name.trim(), email: email.trim(), whatsapp: whatsapp.trim() });
            // Reset form
            setName('');
            setEmail('');
            setWhatsapp('');
            setErrors({});
        }
    };

    const handleClose = () => {
        setErrors({});
        onClose();
    };

    const getTitle = () => {
        if (caseLevel === 'red') {
            return 'Atención Prioritaria Requerida';
        } else if (caseLevel === 'yellow') {
            return 'Validación con Experto';
        }
        return 'Continuar con un Experto';
    };

    const getMessage = () => {
        if (caseLevel === 'red') {
            return 'Tu caso requiere atención urgente de un experto. Por favor, proporciona tus datos para que podamos contactarte de inmediato.';
        } else if (caseLevel === 'yellow') {
            return 'Para brindarte la mejor asesoría, necesitamos que un experto revise tu caso. Déjanos tus datos de contacto.';
        }
        return 'Para conectarte con un experto certificado y continuar con tu consulta, necesitamos tus datos de contacto.';
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            presentationStyle="pageSheet"
            onRequestClose={handleClose}
        >
            <KeyboardAvoidingView
                style={[styles.container, { backgroundColor: colors.background }]}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <View style={[styles.header, { borderBottomColor: colors.border }]}>
                    <View style={styles.headerContent}>
                        <View
                            style={[
                                styles.iconContainer,
                                {
                                    backgroundColor:
                                        caseLevel === 'red'
                                            ? colors.error
                                            : caseLevel === 'yellow'
                                                ? colors.warning
                                                : colors.primary,
                                },
                            ]}
                        >
                            <Ionicons
                                name={
                                    caseLevel === 'red'
                                        ? 'alert-circle'
                                        : caseLevel === 'yellow'
                                            ? 'warning'
                                            : 'person-add'
                                }
                                size={28}
                                color="#FFF"
                            />
                        </View>
                        <Text style={[styles.title, { color: colors.text }]}>{getTitle()}</Text>
                    </View>
                    <TouchableOpacity onPress={handleClose}>
                        <Ionicons name="close" size={28} color={colors.text} />
                    </TouchableOpacity>
                </View>

                <ScrollView
                    contentContainerStyle={styles.content}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    <Text style={[styles.message, { color: colors.textSecondary }]}>{getMessage()}</Text>

                    <View style={styles.form}>
                        <View style={styles.inputGroup}>
                            <Text style={[styles.label, { color: colors.text }]}>
                                Nombre completo <Text style={{ color: colors.error }}>*</Text>
                            </Text>
                            <TextInput
                                style={[
                                    styles.input,
                                    { backgroundColor: colors.backgroundSecondary, color: colors.text },
                                    errors.name && { borderColor: colors.error, borderWidth: 1 },
                                ]}
                                placeholder="Ej: Juan Pérez"
                                placeholderTextColor={colors.textTertiary}
                                value={name}
                                onChangeText={setName}
                                autoCapitalize="words"
                            />
                            {errors.name && <Text style={[styles.errorText, { color: colors.error }]}>{errors.name}</Text>}
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={[styles.label, { color: colors.text }]}>
                                Correo electrónico <Text style={{ color: colors.error }}>*</Text>
                            </Text>
                            <TextInput
                                style={[
                                    styles.input,
                                    { backgroundColor: colors.backgroundSecondary, color: colors.text },
                                    errors.email && { borderColor: colors.error, borderWidth: 1 },
                                ]}
                                placeholder="Ej: juan@ejemplo.com"
                                placeholderTextColor={colors.textTertiary}
                                value={email}
                                onChangeText={setEmail}
                                keyboardType="email-address"
                                autoCapitalize="none"
                            />
                            {errors.email && <Text style={[styles.errorText, { color: colors.error }]}>{errors.email}</Text>}
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={[styles.label, { color: colors.text }]}>
                                WhatsApp <Text style={{ color: colors.error }}>*</Text>
                            </Text>
                            <TextInput
                                style={[
                                    styles.input,
                                    { backgroundColor: colors.backgroundSecondary, color: colors.text },
                                    errors.whatsapp && { borderColor: colors.error, borderWidth: 1 },
                                ]}
                                placeholder="Ej: +52 55 1234 5678"
                                placeholderTextColor={colors.textTertiary}
                                value={whatsapp}
                                onChangeText={setWhatsapp}
                                keyboardType="phone-pad"
                            />
                            {errors.whatsapp && (
                                <Text style={[styles.errorText, { color: colors.error }]}>{errors.whatsapp}</Text>
                            )}
                        </View>

                        <View style={[styles.infoBox, { backgroundColor: colors.backgroundTertiary }]}>
                            <Ionicons name="shield-checkmark" size={20} color={colors.primary} />
                            <Text style={[styles.infoText, { color: colors.textSecondary }]}>
                                Tus datos están protegidos y solo se usarán para conectarte con un experto certificado.
                            </Text>
                        </View>
                    </View>
                </ScrollView>

                <View style={[styles.footer, { borderTopColor: colors.border }]}>
                    <TouchableOpacity
                        style={[
                            styles.submitButton,
                            {
                                backgroundColor:
                                    caseLevel === 'red'
                                        ? colors.error
                                        : caseLevel === 'yellow'
                                            ? colors.warning
                                            : colors.primary,
                            },
                        ]}
                        onPress={handleSubmit}
                    >
                        <Text style={styles.submitButtonText}>Continuar</Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: Spacing.md,
        borderBottomWidth: 1,
    },
    headerContent: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        gap: Spacing.md,
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: BorderRadius.full,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        ...Typography.h3,
        flex: 1,
    },
    content: {
        padding: Spacing.md,
        paddingBottom: Spacing.xxl,
    },
    message: {
        ...Typography.body,
        marginBottom: Spacing.lg,
        lineHeight: 24,
    },
    form: {
        gap: Spacing.md,
    },
    inputGroup: {
        gap: Spacing.xs,
    },
    label: {
        ...Typography.h4,
        fontSize: 14,
    },
    input: {
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.md,
        borderRadius: BorderRadius.md,
        ...Typography.body,
    },
    errorText: {
        ...Typography.caption,
        marginTop: 4,
    },
    infoBox: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.sm,
        padding: Spacing.md,
        borderRadius: BorderRadius.md,
        marginTop: Spacing.sm,
    },
    infoText: {
        ...Typography.bodySmall,
        flex: 1,
    },
    footer: {
        padding: Spacing.md,
        borderTopWidth: 1,
    },
    submitButton: {
        paddingVertical: Spacing.md,
        borderRadius: BorderRadius.md,
        alignItems: 'center',
    },
    submitButtonText: {
        ...Typography.button,
        color: '#FFF',
    },
});
