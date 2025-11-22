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
    ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing } from '@/constants/Colors';
import { expertApplicationService, ExpertMetrics, ExpertInsights } from '@/services/expertApplicationService';
import { expertsService } from '@/services/expertsService';
import { leadsService } from '@/services/leadsService';
import { useExpertStatus } from '@/hooks/useExpertStatus';
import { useRealTimeMessages } from '@/hooks/useRealTimeMessages';
import { useAuth } from '@/hooks/useAuth';

type VerificationStatus = 'pending' | 'approved' | 'rejected';

export default function ExpertsDashboardScreen() {
    // Always use dark theme
    const colors = Colors.dark;
    const router = useRouter();
    const { user, profile } = useAuth(); // Usar datos reales del AuthContext
    const { status, setStatus, notifications, unreadCount, markAsRead, refreshNotifications } = useExpertStatus();
    const { unreadCount: unreadMessagesCount, hasNewMessages } = useRealTimeMessages();

    const [expertData, setExpertData] = useState<any>(null);
    const [verificationStatus, setVerificationStatus] = useState<VerificationStatus>('pending');
    const [profileCompletion, setProfileCompletion] = useState({ isComplete: false, missingFields: [] as string[] });
    const [leadCount, setLeadCount] = useState(0);
    const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
    const [metrics, setMetrics] = useState<ExpertMetrics | null>(null);
    const [insights, setInsights] = useState<ExpertInsights | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user && profile) {
            loadExpertData();
        }
    }, [user, profile]);

    const loadExpertData = async () => {
        try {
            console.log('📊 Cargando datos del experto desde Supabase...');
            setLoading(true);

            if (!user) {
                console.error('❌ No hay usuario autenticado');
                return;
            }

            // NUEVO: Obtener datos reales del experto desde Supabase
            const expertProfile = await expertsService.getExpertByUserId(user.id);

            if (expertProfile) {
                console.log('✅ Perfil de experto encontrado:', expertProfile.specialty);
                setExpertData(expertProfile);
                setVerificationStatus(expertProfile.status as VerificationStatus);

                // NUEVO: Obtener estadísticas reales desde la función RPC de Supabase
                const realStats = await expertsService.getExpertStats(expertProfile.id);
                if (realStats) {
                    console.log('✅ Estadísticas reales cargadas:', realStats);
                    setLeadCount(Number(realStats.total_leads) || 0);
                    
                    // Convertir stats de Supabase a formato de métricas
                    const realMetrics: ExpertMetrics = {
                        totalLeads: Number(realStats.total_leads) || 0,
                        greenCount: 0, // Estos los calculamos más adelante con los leads filtrados
                        yellowCount: 0,
                        redCount: 0,
                        topSpecialty: expertProfile.specialty,
                        conversionRate: 0,
                        avgResponseTime: 15,
                    };
                    setMetrics(realMetrics);
                }

                // NUEVO: Obtener leads reales asignados al experto
                const realLeads = await leadsService.getLeadsAssignedToExpert(expertProfile.id);
                console.log(`✅ ${realLeads.length} leads reales cargados`);

                // Calcular métricas basadas en leads reales
                if (realLeads.length > 0) {
                    const priorityCounts = {
                        low: realLeads.filter(l => l.priority === 'low').length,
                        medium: realLeads.filter(l => l.priority === 'medium').length,
                        high: realLeads.filter(l => l.priority === 'high').length,
                        urgent: realLeads.filter(l => l.priority === 'urgent').length,
                    };

                    setMetrics(prev => ({
                        ...prev!,
                        greenCount: priorityCounts.low,
                        yellowCount: priorityCounts.medium,
                        redCount: priorityCounts.high + priorityCounts.urgent,
                    }));
                }

                // Profile completion basado en datos reales
                const missingFields = [];
                if (!expertProfile.bio) missingFields.push('Biografía');
                if (!expertProfile.hourly_rate || expertProfile.hourly_rate === 0) missingFields.push('Tarifa');
                if (!expertProfile.certifications || expertProfile.certifications.length === 0) missingFields.push('Certificaciones');
                
                setProfileCompletion({
                    isComplete: missingFields.length === 0,
                    missingFields,
                });
            } else {
                console.log('⚠️ Usuario no registrado como experto, usando datos de aplicación...');
                // Fallback a expertApplicationService si no está en Supabase aún
                const profile = expertApplicationService.getProfessionalProfile();
                if (profile) {
                    setExpertData(profile);
                }

                const completion = expertApplicationService.getProfileCompletionStatus();
                setProfileCompletion(completion);

                const leads = await expertApplicationService.getAllLeads();
                setLeadCount(leads.length);

                const calculatedMetrics = await expertApplicationService.calculateMetrics();
                setMetrics(calculatedMetrics);
            }

            // Load selected plan (esto aún es local)
            const plan = expertApplicationService.getSelectedPlan();
            setSelectedPlan(plan);

            // Generate insights (usando datos calculados)
            const generatedInsights = expertApplicationService.generateInsights();
            setInsights(generatedInsights);

        } catch (error) {
            console.error('❌ Error cargando datos del experto:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        Alert.alert(
            'Cerrar sesión',
            '¿Estás seguro que deseas cerrar sesión?',
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Cerrar sesión',
                    style: 'destructive',
                    onPress: async () => {
                        await expertApplicationService.logoutExpert();
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

    if (loading || !expertData) {
        return (
            <View style={[styles.container, { backgroundColor: colors.background }, { justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size="large" color={colors.primary} />
                <Text style={[styles.loadingText, { color: colors.textSecondary, marginTop: Spacing.md }]}>
                    {loading ? 'Cargando datos desde Supabase...' : 'Cargando dashboard...'}
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

            {/* Intelligent Summary Card */}
            <View style={[styles.intelligentSummaryCard, { backgroundColor: colors.cardBackground }]}>
                <View style={styles.summaryHeader}>
                    <Ionicons name="analytics" size={28} color={colors.primary} />
                    <View style={styles.summaryHeaderText}>
                        <Text style={[styles.summaryTitle, { color: colors.text }]}>
                            Resumen Inteligente
                        </Text>
                        <Text style={[styles.summarySubtitle, { color: colors.textSecondary }]}>
                            Actualizado automáticamente
                        </Text>
                    </View>
                </View>

                <View style={styles.metricsGrid}>
                    {/* Total Leads */}
                    <View style={styles.metricItem}>
                        <Text style={[styles.metricLabel, { color: colors.textSecondary }]}>
                            Total Leads
                        </Text>
                        <Text style={[styles.metricValue, { color: colors.text }]}>
                            {metrics?.totalLeads || 0}
                        </Text>
                    </View>

                    {/* Leads by Severity */}
                    <View style={styles.metricItem}>
                        <Text style={[styles.metricLabel, { color: colors.textSecondary }]}>
                            Por Gravedad
                        </Text>
                        <View style={styles.severityBadges}>
                            <View style={styles.severityBadge}>
                                <View style={[styles.severityDot, { backgroundColor: '#10B981' }]} />
                                <Text style={[styles.severityCount, { color: colors.text }]}>
                                    {metrics?.greenCount || 0}
                                </Text>
                            </View>
                            <View style={styles.severityBadge}>
                                <View style={[styles.severityDot, { backgroundColor: '#F59E0B' }]} />
                                <Text style={[styles.severityCount, { color: colors.text }]}>
                                    {metrics?.yellowCount || 0}
                                </Text>
                            </View>
                            <View style={styles.severityBadge}>
                                <View style={[styles.severityDot, { backgroundColor: '#EF4444' }]} />
                                <Text style={[styles.severityCount, { color: colors.text }]}>
                                    {metrics?.redCount || 0}
                                </Text>
                            </View>
                        </View>
                    </View>

                    {/* Top Specialty */}
                    <View style={styles.metricItem}>
                        <Text style={[styles.metricLabel, { color: colors.textSecondary }]}>
                            Especialidad más solicitada
                        </Text>
                        <Text style={[styles.metricValue, { color: colors.primary }]}>
                            {metrics?.topSpecialty || 'N/A'}
                        </Text>
                    </View>

                    {/* Conversion Rate */}
                    <View style={styles.metricItem}>
                        <Text style={[styles.metricLabel, { color: colors.textSecondary }]}>
                            Conversión
                        </Text>
                        <Text style={[styles.metricValue, { color: colors.text }]}>
                            {metrics?.conversionRate.toFixed(1) || 0}%
                        </Text>
                    </View>

                    {/* Avg Response Time */}
                    <View style={styles.metricItem}>
                        <Text style={[styles.metricLabel, { color: colors.textSecondary }]}>
                            Tiempo promedio
                        </Text>
                        <Text style={[styles.metricValue, { color: colors.text }]}>
                            {metrics?.avgResponseTime.toFixed(0) || 0} min
                        </Text>
                    </View>
                </View>

                <TouchableOpacity
                    style={styles.viewReportButton}
                    onPress={() => router.push('/experts-report')}
                >
                    <Text style={[styles.viewReportText, { color: colors.primary }]}>
                        Ver Reporte Completo
                    </Text>
                    <Ionicons name="arrow-forward" size={20} color={colors.primary} />
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.viewReportButton, { marginTop: 12 }]}
                    onPress={() => router.push('/experts-leads')}
                >
                    <Ionicons name="list" size={20} color={colors.primary} />
                    <Text style={[styles.viewReportText, { color: colors.primary }]}>
                        Ver Todos los Leads
                    </Text>
                    <Ionicons name="arrow-forward" size={20} color={colors.primary} />
                </TouchableOpacity>
            </View>

            {/* Status and Notifications Row */}
            <View style={styles.statusNotifRow}>
                {/* Status Card */}
                <View style={[styles.statusCard, { backgroundColor: colors.cardBackground }]}>
                    <Text style={[styles.statusCardTitle, { color: colors.text }]}>Estado</Text>
                    <View style={styles.statusButtons}>
                        <TouchableOpacity
                            style={[
                                styles.statusButton,
                                status === 'online' && { backgroundColor: '#10B981' }
                            ]}
                            onPress={() => setStatus('online')}
                        >
                            <Ionicons
                                name="checkmark-circle"
                                size={20}
                                color={status === 'online' ? '#FFFFFF' : '#10B981'}
                            />
                            <Text style={[
                                styles.statusButtonText,
                                { color: status === 'online' ? '#FFFFFF' : '#10B981' }
                            ]}>
                                Online
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[
                                styles.statusButton,
                                status === 'busy' && { backgroundColor: '#F59E0B' }
                            ]}
                            onPress={() => setStatus('busy')}
                        >
                            <Ionicons
                                name="time"
                                size={20}
                                color={status === 'busy' ? '#FFFFFF' : '#F59E0B'}
                            />
                            <Text style={[
                                styles.statusButtonText,
                                { color: status === 'busy' ? '#FFFFFF' : '#F59E0B' }
                            ]}>
                                Ocupado
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[
                                styles.statusButton,
                                status === 'offline' && { backgroundColor: '#6B7280' }
                            ]}
                            onPress={() => setStatus('offline')}
                        >
                            <Ionicons
                                name="close-circle"
                                size={20}
                                color={status === 'offline' ? '#FFFFFF' : '#6B7280'}
                            />
                            <Text style={[
                                styles.statusButtonText,
                                { color: status === 'offline' ? '#FFFFFF' : '#6B7280' }
                            ]}>
                                Offline
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Notifications Card */}
                <View style={[styles.notifCard, { backgroundColor: colors.cardBackground }]}>
                    <View style={styles.notifHeader}>
                        <Ionicons name="notifications" size={24} color={colors.primary} />
                        {unreadCount > 0 && (
                            <View style={styles.notifBadge}>
                                <Text style={styles.notifBadgeText}>{unreadCount}</Text>
                            </View>
                        )}
                    </View>
                    <Text style={[styles.notifTitle, { color: colors.text }]}>
                        Notificaciones
                    </Text>
                    {notifications.length === 0 ? (
                        <Text style={[styles.notifEmpty, { color: colors.textSecondary }]}>
                            Sin notificaciones
                        </Text>
                    ) : (
                        <View style={styles.notifList}>
                            {notifications.slice(0, 3).map((notif) => {
                                const severityColor =
                                    notif.severity === 'high' ? '#EF4444' :
                                        notif.severity === 'medium' ? '#F59E0B' : '#10B981';

                                return (
                                    <TouchableOpacity
                                        key={notif.id}
                                        style={styles.notifItem}
                                        onPress={() => markAsRead(notif.id)}
                                    >
                                        <View style={[styles.severityDot, { backgroundColor: severityColor }]} />
                                        <View style={styles.notifContent}>
                                            <Text
                                                style={[
                                                    styles.notifName,
                                                    { color: colors.text },
                                                    !notif.isRead && { fontWeight: '700' }
                                                ]}
                                                numberOfLines={1}
                                            >
                                                {notif.leadName}
                                            </Text>
                                            <Text
                                                style={[styles.notifCase, { color: colors.textSecondary }]}
                                                numberOfLines={1}
                                            >
                                                {notif.caseTitle}
                                            </Text>
                                        </View>
                                        {!notif.isRead && <View style={styles.unreadDot} />}
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                    )}
                </View>
            </View>

            {/* Main Cards */}
            <View style={styles.cardsContainer}>
                {/* Leads Card */}
                <TouchableOpacity
                    style={[styles.card, { backgroundColor: colors.cardBackground }]}
                    onPress={() => Alert.alert('Próximamente', 'Funcionalidad en desarrollo')}
                >
                    <View style={styles.cardHeader}>
                        <Ionicons name="people" size={32} color={colors.primary} />
                        <Text style={[styles.cardNumber, { color: colors.text }]}>
                            {leadCount}
                        </Text>
                    </View>
                    <Text style={[styles.cardTitle, { color: colors.text }]}>
                        Leads recibidos
                    </Text>
                    <TouchableOpacity style={styles.cardButton}>
                        <Text style={[styles.cardButtonText, { color: colors.primary }]}>
                            Ver leads
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

                {/* Plan Card */}
                <TouchableOpacity
                    style={[styles.card, styles.fullWidthCard, { backgroundColor: colors.cardBackground }]}
                    onPress={() => router.push('/experts-plans')}
                >
                    <View style={styles.cardHeader}>
                        <Ionicons name="diamond" size={32} color={colors.primary} />
                        <View style={[styles.planBadge, { backgroundColor: colors.primary, opacity: 0.15 }]}>
                            <Text style={[styles.planBadgeText, { color: colors.primary }]}>
                                {selectedPlan ? selectedPlan.toUpperCase() : 'FREE'}
                            </Text>
                        </View>
                    </View>
                    <Text style={[styles.cardTitle, { color: colors.text }]}>
                        Plan actual
                    </Text>
                    <TouchableOpacity style={styles.cardButton}>
                        <Text style={[styles.cardButtonText, { color: colors.primary }]}>
                            {selectedPlan ? 'Cambiar plan' : 'Ver planes'}
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

            {/* Insights Card */}
            <View style={[styles.insightsCard, { backgroundColor: colors.cardBackground }]}>
                <View style={styles.insightsHeader}>
                    <Ionicons name="bulb" size={24} color={colors.primary} />
                    <Text style={[styles.insightsTitle, { color: colors.text }]}>
                        Insights Automáticos
                    </Text>
                </View>

                <View style={styles.insightsList}>
                    <View style={styles.insightItem}>
                        <Text style={[styles.insightLabel, { color: colors.textSecondary }]}>
                            Especialidad más fuerte:
                        </Text>
                        <Text style={[styles.insightValue, { color: colors.primary }]}>
                            {insights?.strongestSpecialty || 'N/A'}
                        </Text>
                    </View>

                    <View style={styles.insightItem}>
                        <Text style={[styles.insightLabel, { color: colors.textSecondary }]}>
                            Área de riesgo:
                        </Text>
                        <Text
                            style={[
                                styles.insightValue,
                                {
                                    color:
                                        insights?.mainRiskArea === 'Riesgo alto'
                                            ? '#EF4444'
                                            : insights?.mainRiskArea === 'Riesgo moderado'
                                                ? '#F59E0B'
                                                : '#10B981',
                                },
                            ]}
                        >
                            {insights?.mainRiskArea || 'N/A'}
                        </Text>
                    </View>

                    <View style={styles.insightItem}>
                        <Text style={[styles.insightLabel, { color: colors.textSecondary }]}>
                            Acción recomendada:
                        </Text>
                        <Text style={[styles.insightValue, { color: colors.text }]}>
                            {insights?.recommendedAction || 'N/A'}
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
    planBadge: {
        paddingVertical: Spacing.xs,
        paddingHorizontal: Spacing.sm,
        borderRadius: 12,
    },
    planBadgeText: {
        ...Typography.caption,
        fontSize: 12,
        fontWeight: '700',
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
    // Status and Notification Styles
    statusNotifRow: {
        flexDirection: 'row',
        gap: Spacing.md,
        marginBottom: Spacing.lg,
    },
    statusCard: {
        flex: 1,
        padding: Spacing.md,
        borderRadius: 12,
    },
    statusCardTitle: {
        ...Typography.h4,
        fontSize: 14,
        fontWeight: '600',
        marginBottom: Spacing.sm,
    },
    statusButtons: {
        gap: Spacing.xs,
    },
    statusButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: Spacing.xs,
        paddingVertical: Spacing.xs,
        paddingHorizontal: Spacing.sm,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: 'transparent',
    },
    statusButtonText: {
        ...Typography.caption,
        fontSize: 12,
        fontWeight: '600',
    },
    notifCard: {
        flex: 1,
        padding: Spacing.md,
        borderRadius: 12,
    },
    notifHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: Spacing.xs,
    },
    notifBadge: {
        backgroundColor: '#EF4444',
        borderRadius: 10,
        minWidth: 20,
        height: 20,
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: Spacing.xs,
    },
    notifBadgeText: {
        color: '#FFFFFF',
        fontSize: 12,
        fontWeight: '700',
    },
    notifTitle: {
        ...Typography.h4,
        fontSize: 14,
        fontWeight: '600',
        marginBottom: Spacing.sm,
    },
    notifEmpty: {
        ...Typography.caption,
        fontSize: 12,
        textAlign: 'center',
        marginTop: Spacing.xs,
    },
    notifList: {
        gap: Spacing.xs,
    },
    notifItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.xs,
        paddingVertical: Spacing.xs,
    },
    severityDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },
    notifContent: {
        flex: 1,
    },
    notifName: {
        ...Typography.caption,
        fontSize: 13,
    },
    notifCase: {
        ...Typography.caption,
        fontSize: 11,
    },
    unreadDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#EF4444',
    },
    // Intelligent Summary Card Styles
    intelligentSummaryCard: {
        padding: Spacing.lg,
        borderRadius: 12,
        marginBottom: Spacing.lg,
    },
    summaryHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: Spacing.md,
        gap: Spacing.sm,
    },
    summaryHeaderText: {
        flex: 1,
    },
    summaryTitle: {
        ...Typography.h3,
        fontSize: 18,
        fontWeight: '700',
    },
    summarySubtitle: {
        ...Typography.caption,
        fontSize: 12,
        marginTop: 2,
    },
    metricsGrid: {
        gap: Spacing.md,
        marginBottom: Spacing.md,
    },
    metricItem: {
        marginBottom: Spacing.xs,
    },
    metricLabel: {
        ...Typography.caption,
        fontSize: 12,
        marginBottom: 4,
    },
    metricValue: {
        ...Typography.h3,
        fontSize: 24,
        fontWeight: '700',
    },
    severityBadges: {
        flexDirection: 'row',
        gap: Spacing.md,
        marginTop: 4,
    },
    severityBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    severityCount: {
        ...Typography.body,
        fontSize: 16,
        fontWeight: '600',
    },
    viewReportButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: Spacing.xs,
        paddingVertical: Spacing.sm,
        marginTop: Spacing.sm,
    },
    viewReportText: {
        ...Typography.body,
        fontSize: 15,
        fontWeight: '600',
    },
    // Insights Card Styles
    insightsCard: {
        padding: Spacing.lg,
        borderRadius: 12,
        marginBottom: Spacing.lg,
    },
    insightsHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.sm,
        marginBottom: Spacing.md,
    },
    insightsTitle: {
        ...Typography.h3,
        fontSize: 18,
        fontWeight: '700',
    },
    insightsList: {
        gap: Spacing.md,
    },
    insightItem: {
        marginBottom: Spacing.xs,
    },
    insightLabel: {
        ...Typography.caption,
        fontSize: 13,
        marginBottom: 4,
    },
    insightValue: {
        ...Typography.body,
        fontSize: 16,
        fontWeight: '600',
    },
});

