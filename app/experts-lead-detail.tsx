import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, TextInput, Modal, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { expertApplicationService, ExpertLead, LeadStatus, LeadMessage } from '@/services/expertApplicationService';
import { useRealTimeMessages } from '@/hooks/useRealTimeMessages';

export default function ExpertLeadDetailScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const leadId = params.id as string;
    const { refreshNow } = useRealTimeMessages();

    const [lead, setLead] = useState<ExpertLead | null>(null);
    const [loading, setLoading] = useState(true);
    const [showResponseModal, setShowResponseModal] = useState(false);
    const [responseMessage, setResponseMessage] = useState('');
    const [sending, setSending] = useState(false);
    const [messages, setMessages] = useState<LeadMessage[]>([]);

    useEffect(() => {
        loadLead();
        loadMessages();
        // Mark messages as read when viewing
        expertApplicationService.markLeadMessagesAsRead(leadId);
    }, [leadId]);

    // Auto-refresh messages every 10 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            loadMessages();
        }, 10000);

        return () => clearInterval(interval);
    }, [leadId]);

    const loadMessages = async () => {
        try {
            const msgs = await expertApplicationService.getMessagesByLeadId(leadId);
            setMessages(msgs);
        } catch (error) {
            console.error('Error loading messages:', error);
        }
    };

    const loadLead = async () => {
        setLoading(true);
        try {
            const loadedLead = await expertApplicationService.getLeadById(leadId);
            setLead(loadedLead);
        } catch (error) {
            console.error('Error loading lead:', error);
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (newStatus: LeadStatus) => {
        if (!lead) return;

        try {
            await expertApplicationService.updateLeadStatus(lead.id, newStatus);
            await loadLead();
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };

    const sendResponse = async () => {
        if (!lead || !responseMessage.trim()) return;

        setSending(true);
        try {
            await expertApplicationService.addResponseToLead(lead.id, responseMessage.trim());
            setResponseMessage('');
            setShowResponseModal(false);
            await loadLead();
        } catch (error) {
            console.error('Error sending response:', error);
        } finally {
            setSending(false);
        }
    };

    const getSeverityColor = (severity: 'low' | 'medium' | 'high') => {
        switch (severity) {
            case 'low': return '#10B981';
            case 'medium': return '#F59E0B';
            case 'high': return '#EF4444';
        }
    };

    const getStatusColor = (status: LeadStatus) => {
        switch (status) {
            case 'new': return '#3B82F6';
            case 'in_progress': return '#F59E0B';
            case 'closed': return '#10B981';
        }
    };

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString('es-MX', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#92BF4E" />
                <Text style={styles.loadingText}>Cargando lead...</Text>
            </View>
        );
    }

    if (!lead) {
        return (
            <View style={styles.errorContainer}>
                <Ionicons name="alert-circle-outline" size={64} color="#666" />
                <Text style={styles.errorText}>Lead no encontrado</Text>
                <Pressable style={styles.backButton} onPress={() => router.back()}>
                    <Text style={styles.backButtonText}>Volver</Text>
                </Pressable>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Pressable onPress={() => router.back()} style={styles.backBtn}>
                    <Ionicons name="arrow-back" size={24} color="#FFF" />
                </Pressable>
                <View style={styles.headerTitle}>
                    <Text style={styles.headerText} numberOfLines={1}>{lead.fullName}</Text>
                    <View style={[styles.severityBadge, { backgroundColor: getSeverityColor(lead.severity) + '20', borderColor: getSeverityColor(lead.severity) }]}>
                        <View style={[styles.severityDot, { backgroundColor: getSeverityColor(lead.severity) }]} />
                        <Text style={[styles.severityText, { color: getSeverityColor(lead.severity) }]}>
                            {lead.severity === 'low' ? 'Baja' : lead.severity === 'medium' ? 'Media' : 'Alta'}
                        </Text>
                    </View>
                </View>
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {/* Lead Info Card */}
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Información del Lead</Text>

                    <View style={styles.infoRow}>
                        <Ionicons name="person-outline" size={20} color="#92BF4E" />
                        <View style={styles.infoContent}>
                            <Text style={styles.infoLabel}>Nombre Completo</Text>
                            <Text style={styles.infoValue}>{lead.fullName}</Text>
                        </View>
                    </View>

                    <View style={styles.infoRow}>
                        <Ionicons name="mail-outline" size={20} color="#92BF4E" />
                        <View style={styles.infoContent}>
                            <Text style={styles.infoLabel}>Email</Text>
                            <Text style={styles.infoValue}>{lead.email}</Text>
                        </View>
                    </View>

                    <View style={styles.infoRow}>
                        <Ionicons name="call-outline" size={20} color="#92BF4E" />
                        <View style={styles.infoContent}>
                            <Text style={styles.infoLabel}>Teléfono</Text>
                            <Text style={styles.infoValue}>{lead.phone}</Text>
                        </View>
                    </View>

                    <View style={styles.infoRow}>
                        <Ionicons name="briefcase-outline" size={20} color="#92BF4E" />
                        <View style={styles.infoContent}>
                            <Text style={styles.infoLabel}>Especialidad</Text>
                            <Text style={styles.infoValue}>{lead.specialty}</Text>
                        </View>
                    </View>

                    <View style={styles.infoRow}>
                        <Ionicons name="calendar-outline" size={20} color="#92BF4E" />
                        <View style={styles.infoContent}>
                            <Text style={styles.infoLabel}>Fecha de Creación</Text>
                            <Text style={styles.infoValue}>{formatDate(lead.createdAt)}</Text>
                        </View>
                    </View>

                    {lead.caseSummary && (
                        <View style={styles.summarySection}>
                            <Text style={styles.summaryLabel}>Resumen del Caso</Text>
                            <Text style={styles.summaryText}>{lead.caseSummary}</Text>
                        </View>
                    )}
                </View>

                {/* Status Card */}
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Estado del Lead</Text>

                    <View style={styles.statusButtons}>
                        <Pressable
                            style={[styles.statusButton, lead.status === 'new' && styles.statusButtonActive]}
                            onPress={() => updateStatus('new')}
                        >
                            <Text style={[styles.statusButtonText, lead.status === 'new' && { color: getStatusColor('new') }]}>
                                Nuevo
                            </Text>
                        </Pressable>

                        <Pressable
                            style={[styles.statusButton, lead.status === 'in_progress' && styles.statusButtonActive]}
                            onPress={() => updateStatus('in_progress')}
                        >
                            <Text style={[styles.statusButtonText, lead.status === 'in_progress' && { color: getStatusColor('in_progress') }]}>
                                En Progreso
                            </Text>
                        </Pressable>

                        <Pressable
                            style={[styles.statusButton, lead.status === 'closed' && styles.statusButtonActive]}
                            onPress={() => updateStatus('closed')}
                        >
                            <Text style={[styles.statusButtonText, lead.status === 'closed' && { color: getStatusColor('closed') }]}>
                                Cerrado
                            </Text>
                        </Pressable>
                    </View>
                </View>

                {/* Responses Card */}
                <View style={styles.card}>
                    <View style={styles.cardHeader}>
                        <Text style={styles.cardTitle}>Historial de Respuestas</Text>
                        <Text style={styles.responseCount}>{lead.responses.length}</Text>
                    </View>

                    {lead.responses.length === 0 ? (
                        <View style={styles.emptyState}>
                            <Ionicons name="chatbubbles-outline" size={48} color="#444" />
                            <Text style={styles.emptyText}>Sin respuestas aún</Text>
                        </View>
                    ) : (
                        <View style={styles.responsesList}>
                            {lead.responses.map((response, index) => (
                                <View key={response.id} style={styles.responseItem}>
                                    <View style={styles.responseHeader}>
                                        <Ionicons name="checkmark-circle" size={16} color="#92BF4E" />
                                        <Text style={styles.responseDate}>{formatDate(response.createdAt)}</Text>
                                    </View>
                                    <Text style={styles.responseMessage}>{response.message}</Text>
                                </View>
                            ))}
                        </View>
                    )}
                </View>

                {/* Action Buttons */}
                <View style={styles.actions}>
                    <Pressable
                        style={styles.primaryButton}
                        onPress={() => setShowResponseModal(true)}
                    >
                        <Ionicons name="send" size={20} color="#000" />
                        <Text style={styles.primaryButtonText}>Enviar Respuesta</Text>
                    </Pressable>

                    {lead.status !== 'closed' && (
                        <Pressable
                            style={styles.secondaryButton}
                            onPress={() => updateStatus('closed')}
                        >
                            <Ionicons name="checkmark-circle-outline" size={20} color="#92BF4E" />
                            <Text style={styles.secondaryButtonText}>Marcar como Completado</Text>
                        </Pressable>
                    )}
                </View>
            </ScrollView>

            {/* Response Modal */}
            <Modal
                visible={showResponseModal}
                transparent
                animationType="slide"
                onRequestClose={() => setShowResponseModal(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Responder a {lead.fullName}</Text>
                            <Pressable onPress={() => setShowResponseModal(false)}>
                                <Ionicons name="close" size={24} color="#FFF" />
                            </Pressable>
                        </View>

                        <TextInput
                            style={styles.modalInput}
                            placeholder="Escribe tu respuesta aquí..."
                            placeholderTextColor="#666"
                            multiline
                            numberOfLines={6}
                            value={responseMessage}
                            onChangeText={setResponseMessage}
                            textAlignVertical="top"
                        />

                        <Text style={styles.charCount}>
                            {responseMessage.length} caracteres
                        </Text>

                        <View style={styles.modalActions}>
                            <Pressable
                                style={styles.modalCancelButton}
                                onPress={() => setShowResponseModal(false)}
                                disabled={sending}
                            >
                                <Text style={styles.modalCancelText}>Cancelar</Text>
                            </Pressable>

                            <Pressable
                                style={[styles.modalSendButton, (!responseMessage.trim() || sending) && styles.modalSendButtonDisabled]}
                                onPress={sendResponse}
                                disabled={!responseMessage.trim() || sending}
                            >
                                {sending ? (
                                    <ActivityIndicator size="small" color="#000" />
                                ) : (
                                    <>
                                        <Ionicons name="send" size={18} color="#000" />
                                        <Text style={styles.modalSendText}>Enviar</Text>
                                    </>
                                )}
                            </Pressable>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0a0a0a',
    },
    loadingContainer: {
        flex: 1,
        backgroundColor: '#0a0a0a',
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        color: '#AAAAAA',
        fontSize: 16,
        marginTop: 16,
    },
    errorContainer: {
        flex: 1,
        backgroundColor: '#0a0a0a',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
    errorText: {
        color: '#AAAAAA',
        fontSize: 18,
        marginTop: 16,
        marginBottom: 24,
    },
    backButton: {
        backgroundColor: '#92BF4E',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 8,
    },
    backButtonText: {
        color: '#000',
        fontSize: 16,
        fontWeight: '600',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#222',
        gap: 16,
    },
    backBtn: {
        padding: 8,
    },
    headerTitle: {
        flex: 1,
        gap: 8,
    },
    headerText: {
        color: '#FFF',
        fontSize: 20,
        fontWeight: '700',
    },
    severityBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
        borderWidth: 1,
        gap: 6,
    },
    severityDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },
    severityText: {
        fontSize: 12,
        fontWeight: '600',
    },
    content: {
        flex: 1,
        padding: 16,
    },
    card: {
        backgroundColor: '#1a1a1a',
        borderRadius: 16,
        padding: 20,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#333',
    },
    cardTitle: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 16,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    responseCount: {
        color: '#92BF4E',
        fontSize: 16,
        fontWeight: '700',
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 16,
        gap: 12,
    },
    infoContent: {
        flex: 1,
    },
    infoLabel: {
        color: '#888',
        fontSize: 12,
        marginBottom: 4,
    },
    infoValue: {
        color: '#FFF',
        fontSize: 16,
    },
    summarySection: {
        marginTop: 8,
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: '#333',
    },
    summaryLabel: {
        color: '#888',
        fontSize: 12,
        marginBottom: 8,
    },
    summaryText: {
        color: '#FFF',
        fontSize: 15,
        lineHeight: 24,
    },
    statusButtons: {
        flexDirection: 'row',
        gap: 12,
    },
    statusButton: {
        flex: 1,
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#444',
        alignItems: 'center',
    },
    statusButtonActive: {
        backgroundColor: '#92BF4E20',
        borderColor: '#92BF4E',
    },
    statusButtonText: {
        color: '#AAA',
        fontSize: 14,
        fontWeight: '600',
    },
    emptyState: {
        alignItems: 'center',
        paddingVertical: 32,
    },
    emptyText: {
        color: '#666',
        fontSize: 14,
        marginTop: 12,
    },
    responsesList: {
        gap: 12,
    },
    responseItem: {
        backgroundColor: '#0f0f0f',
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#333',
    },
    responseHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 8,
    },
    responseDate: {
        color: '#888',
        fontSize: 12,
    },
    responseMessage: {
        color: '#DDD',
        fontSize: 15,
        lineHeight: 22,
    },
    actions: {
        gap: 12,
        marginBottom: 32,
    },
    primaryButton: {
        backgroundColor: '#92BF4E',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        borderRadius: 12,
        gap: 8,
    },
    primaryButtonText: {
        color: '#000',
        fontSize: 16,
        fontWeight: '700',
    },
    secondaryButton: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: '#92BF4E',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        borderRadius: 12,
        gap: 8,
    },
    secondaryButtonText: {
        color: '#92BF4E',
        fontSize: 16,
        fontWeight: '600',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.9)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: '#1a1a1a',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        padding: 24,
        maxHeight: '80%',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
    },
    modalTitle: {
        color: '#FFF',
        fontSize: 20,
        fontWeight: '700',
    },
    modalInput: {
        backgroundColor: '#0f0f0f',
        borderWidth: 1,
        borderColor: '#333',
        borderRadius: 12,
        padding: 16,
        color: '#FFF',
        fontSize: 16,
        minHeight: 150,
    },
    charCount: {
        color: '#666',
        fontSize: 12,
        textAlign: 'right',
        marginTop: 8,
        marginBottom: 24,
    },
    modalActions: {
        flexDirection: 'row',
        gap: 12,
    },
    modalCancelButton: {
        flex: 1,
        paddingVertical: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#444',
        alignItems: 'center',
    },
    modalCancelText: {
        color: '#AAA',
        fontSize: 16,
        fontWeight: '600',
    },
    modalSendButton: {
        flex: 1,
        backgroundColor: '#92BF4E',
        paddingVertical: 16,
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    modalSendButtonDisabled: {
        opacity: 0.5,
    },
    modalSendText: {
        color: '#000',
        fontSize: 16,
        fontWeight: '700',
    },
});

