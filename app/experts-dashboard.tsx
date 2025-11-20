import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    useColorScheme,
    Image,
    Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing } from '../constants/Colors';
import { expertApplicationService } from '../services/expertApplicationService';

type VerificationStatus = 'pending' | 'approved' | 'rejected';

export default function ExpertsDashboardScreen() {
    const colorScheme = useColorScheme();
    const colors = colorScheme === 'dark' ? Colors.dark : Colors.light;
    const router = useRouter();

    const [expertData, setExpertData] = useState<any>(null);
    const [verificationStatus, setVerificationStatus] = useState<VerificationStatus>('pending');
    const [profileCompletion, setProfileCompletion] = useState({ isComplete: false, missingFields: [] as string[] });

    useEffect(() => {
        // Load expert data
        const profile = expertApplicationService.getProfessionalProfile();
        if (profile) {
            setExpertData(profile);
        }

        // Check profile completion
        const completion = expertApplicationService.getProfileCompletionStatus();
        setProfileCompletion(completion);

        // Simulate verification status (in real app, this would come from backend)
        setVerificationStatus('pending');
    }, []);

    const handleLogout = () => {
        Alert.alert(
            'Cerrar sesión',
            '¿Estás seguro que deseas cerrar sesión?',
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Cerrar sesión',
                    style: 'destructive',
                    onPress: () => {
                        expertApplicationService.logoutExpert();
                        router.push('/');
                    },
                },
            ]
        );
    };

    const getStatusColor = () => {
        switch (verificationStatus) {
            case 'approved':
                return '#10B981';
            case 'rejected':
                return '#EF4444';
            default:
                return '#F59E0B';
        }
    };

    const getStatusText = () => {
        switch (verificationStatus) {
            case 'approved':
                return 'Aprobado';
            case 'rejected':
                return 'Rechazado';
            default:
                return 'En revisión';
        }
    };

    const getStatusIcon = () => {
        switch (verificationStatus) {
            case 'approved':
                return 'checkmark-circle';
            case 'rejected':
                return 'close-circle';
            default:
                return 'time';
        }
    };

    if (!expertData) {
        return (
            <View style={[styles.container, { backgroundColor: colors.background }]}>
                <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
                    Cargando dashboard...
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
            {/* Header with Profile */}
            <View style={[styles.profileHeader, { backgroundColor: colors.cardBackground }]}>
                <View style={styles.profileInfo}>
                    <View style={[styles.avatarPlaceholder, { backgroundColor: colors.primary, opacity: 0.2 }]}>
                        <Ionicons name="person" size={40} color={colors.primary} />
                    </View>
                    <View style={styles.profileText}>
                        <Text style={[styles.profileName, { color: colors.text }]}>
                            {expertData.fullName || 'Experto'}
                        </Text>
                        <Text style={[styles.profileSpecialty, { color: colors.textSecondary }]}>
                            {expertData.specializations?.[0] || expertData.specialty || 'Especialista'}
                        </Text>
                    </View>
                </View>

                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(), opacity: 0.15 }]}>
                    <Ionicons name={getStatusIcon()} size={16} color={getStatusColor()} />
                    <Text style={[styles.statusText, { color: getStatusColor() }]}>
                        {getStatusText()}
                    </Text>
                </View>
            </View>

            {/* Main Cards */}
            <View style={styles.cardsContainer}>
                {/* Clients Card */}
                <TouchableOpacity
                    style={[styles.card, { backgroundColor: colors.cardBackground }]}
                    onPress={() => Alert.alert('Próximamente', 'Funcionalidad en desarrollo')}
                >
                    <View style={styles.cardHeader}>
                        <Ionicons name="people" size={32} color={colors.primary} />
                        <Text style={[styles.cardNumber, { color: colors.text }]}>0</Text>
                    </View>
                    <Text style={[styles.cardTitle, { color: colors.text }]}>
                        Clientes asignados
                    </Text>
                    <TouchableOpacity style={styles.cardButton}>
                        <Text style={[styles.cardButtonText, { color: colors.primary }]}>
                            Ver clientes
                        </Text>
                        <Ionicons name="arrow-forward" size={16} color={colors.primary} />
                    </TouchableOpacity>
                </TouchableOpacity>

                {/* Messages Card */}
                <TouchableOpacity
                    style={[styles.card, { backgroundColor: colors.cardBackground }]}
                    onPress={() => Alert.alert('Próximamente', 'Funcionalidad en desarrollo')}
                >
                    <View style={styles.cardHeader}>
                        <Ionicons name="chatbubbles" size={32} color={colors.primary} />
                        <Text style={[styles.cardNumber, { color: colors.text }]}>0</Text>
                    </View>
                    <Text style={[styles.cardTitle, { color: colors.text }]}>
                        Mensajes
                    </Text>
                    <TouchableOpacity style={styles.cardButton}>
                        <Text style={[styles.cardButtonText, { color: colors.primary }]}>
                            Abrir bandeja
                        </Text>
                        <Ionicons name="arrow-forward" size={16} color={colors.primary} />
                    </TouchableOpacity>
                </TouchableOpacity>

                {/* Profile Card */}
                <TouchableOpacity
                    style={[styles.card, styles.fullWidthCard, { backgroundColor: colors.cardBackground }]}
                    onPress={() => router.push('/experts-profile-summary')}
                >
                    <View style={styles.cardHeader}>
                        <Ionicons name="document-text" size={32} color={colors.primary} />
                        <View style={[
                            styles.completionBadge,
                            { backgroundColor: profileCompletion.isComplete ? '#10B981' : '#F59E0B', opacity: 0.15 }
                        ]}>
                            <Text style={[
                                styles.completionText,
                                { color: profileCompletion.isComplete ? '#10B981' : '#F59E0B' }
                            ]}>
                                {profileCompletion.isComplete ? 'Completo' : 'Incompleto'}
                            </Text>
                        </View>
                    </View>
                    <Text style={[styles.cardTitle, { color: colors.text }]}>
                        Perfil profesional
                    </Text>
                    <TouchableOpacity style={styles.cardButton}>
                        <Text style={[styles.cardButtonText, { color: colors.primary }]}>
                            Editar perfil
                        </Text>
                        <Ionicons name="arrow-forward" size={16} color={colors.primary} />
                    </TouchableOpacity>
                </TouchableOpacity>
            </View>

            {/* Next Steps */}
            <View style={[styles.nextStepsCard, { backgroundColor: colors.cardBackground }]}>
                <Text style={[styles.nextStepsTitle, { color: colors.text }]}>
                    Próximos pasos
                </Text>

                <View style={styles.stepsList}>
                    {!profileCompletion.isComplete && (
                        <View style={styles.step}>
                            <Ionicons name="alert-circle" size={20} color="#F59E0B" />
                            <Text style={[styles.stepText, { color: colors.text }]}>
                                Completar tu expediente
                            </Text>
                        </View>
                    )}

                    <View style={styles.step}>
                        <Ionicons
                            name={verificationStatus === 'approved' ? 'checkmark-circle' : 'time'}
                            size={20}
                            color={verificationStatus === 'approved' ? '#10B981' : colors.primary}
                        />
                        <Text style={[styles.stepText, { color: colors.text }]}>
                            Espera la verificación del equipo Kontify+
                        </Text>
                    </View>

                    <View style={styles.step}>
                        <Ionicons name="calendar" size={20} color={colors.primary} />
                        <Text style={[styles.stepText, { color: colors.text }]}>
                            Configura tus horarios disponibles
                        </Text>
                    </View>

                    <View style={styles.step}>
                        <Ionicons name="book" size={20} color={colors.primary} />
                        <Text style={[styles.stepText, { color: colors.text }]}>
                            Revisa los lineamientos de servicio
                        </Text>
                    </View>
                </View>
            </View>

            {/* Action Buttons */}
            <View style={styles.actionsContainer}>
                <TouchableOpacity
                    style={[styles.actionButton, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}
                    onPress={() => router.push('/experts-profile-summary')}
                >
                    <Ionicons name="eye" size={20} color={colors.text} />
                    <Text style={[styles.actionButtonText, { color: colors.text }]}>
                        Ver mi perfil público
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.actionButton, styles.logoutButton, { borderColor: '#EF4444' }]}
                    onPress={handleLogout}
                >
                    <Ionicons name="log-out" size={20} color="#EF4444" />
                    <Text style={[styles.actionButtonText, { color: '#EF4444' }]}>
                        Cerrar sesión
                    </Text>
                </TouchableOpacity>
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
    loadingText: {
        ...Typography.body,
        fontSize: 16,
        textAlign: 'center',
        marginTop: Spacing.xxl,
    },
    profileHeader: {
        padding: Spacing.lg,
        borderRadius: 12,
        marginBottom: Spacing.lg,
    },
    profileInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: Spacing.md,
    },
    avatarPlaceholder: {
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: Spacing.md,
    },
    profileText: {
        flex: 1,
    },
    profileName: {
        ...Typography.h2,
        fontSize: 22,
        fontWeight: '700',
        marginBottom: Spacing.xs,
    },
    profileSpecialty: {
        ...Typography.body,
        fontSize: 15,
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: Spacing.xs,
        paddingHorizontal: Spacing.md,
        borderRadius: 20,
        alignSelf: 'flex-start',
    },
    statusText: {
        ...Typography.body,
        fontSize: 14,
        fontWeight: '600',
        marginLeft: Spacing.xs,
    },
    cardsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: Spacing.md,
        marginBottom: Spacing.lg,
    },
    card: {
        flex: 1,
        minWidth: '45%',
        padding: Spacing.lg,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    fullWidthCard: {
        minWidth: '100%',
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: Spacing.md,
    },
    cardNumber: {
        ...Typography.h1,
        fontSize: 32,
        fontWeight: '700',
    },
    cardTitle: {
        ...Typography.body,
        fontSize: 16,
        fontWeight: '600',
        marginBottom: Spacing.sm,
    },
    cardButton: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    cardButtonText: {
        ...Typography.body,
        fontSize: 14,
        fontWeight: '600',
        marginRight: Spacing.xs,
    },
    completionBadge: {
        paddingVertical: Spacing.xs,
        paddingHorizontal: Spacing.sm,
        borderRadius: 12,
    },
    completionText: {
        ...Typography.caption,
        fontSize: 12,
        fontWeight: '600',
    },
    nextStepsCard: {
        padding: Spacing.lg,
        borderRadius: 12,
        marginBottom: Spacing.lg,
    },
    nextStepsTitle: {
        ...Typography.h3,
        fontSize: 18,
        fontWeight: '600',
        marginBottom: Spacing.md,
    },
    stepsList: {
        gap: Spacing.md,
    },
    step: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    stepText: {
        ...Typography.body,
        fontSize: 15,
        marginLeft: Spacing.sm,
        flex: 1,
    },
    actionsContainer: {
        gap: Spacing.md,
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: Spacing.md,
        paddingHorizontal: Spacing.lg,
        borderRadius: 12,
        borderWidth: 2,
    },
    logoutButton: {
        backgroundColor: 'transparent',
    },
    actionButtonText: {
        ...Typography.body,
        fontSize: 16,
        fontWeight: '600',
        marginLeft: Spacing.sm,
    },
});
