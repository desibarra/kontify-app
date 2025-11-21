import AsyncStorage from "@react-native-async-storage/async-storage";
import { v4 as uuidv4 } from "uuid";

/* ============================================================
   INTERFACES - FASE 8, 9, 10 (COMPLETAS)
   ============================================================ */

/* -------------------------
   Lead Status (Phase 10)
-------------------------- */
export type LeadStatus = "new" | "in_progress" | "closed";

/* -------------------------
   Lead Response (Phase 10)
-------------------------- */
export interface LeadResponse {
    id: string;
    leadId: string;
    message: string;
    createdAt: string;
}

/* -------------------------
   ExpertLead (Fase 10 completa)
-------------------------- */
export interface ExpertLead {
    id: string;
    fullName: string;
    phone: string;
    email: string;
    specialty: string;
    severity: "low" | "medium" | "high";
    caseSummary?: string;
    caseNotes?: string;
    userContactData?: any;
    createdAt: string;

    /** FASE 10 */
    status: LeadStatus; // new | in_progress | closed
    archived: boolean;
    responses: LeadResponse[];
}

/* -------------------------
   ExpertApplication (no cambia)
-------------------------- */
export interface ExpertApplication {
    id: string;
    fullName: string;
    email: string;
    phone: string;
    specialty: string;
    yearsExperience: number;
    createdAt: string;
}

/* -------------------------
   Notifications (Fase 8)
-------------------------- */
export interface ExpertNotification {
    id: string;
    title: string;
    message: string;
    severity: "low" | "medium" | "high";
    createdAt: string;
    isRead: boolean;
    caseTitle?: string;
}

/* -------------------------
   Expert Status (Fase 8)
-------------------------- */
export type ExpertStatus = "online" | "busy" | "offline";

/* -------------------------
   Metrics (Fase 9)
-------------------------- */
export interface ExpertMetrics {
    totalLeads: number;
    greenCount: number;
    yellowCount: number;
    redCount: number;
    avgResponseTime: number;
    conversionRate: number;
    topSpecialty: string;
    top3Specialties: string[];
    lastUpdated: string;
}

/* -------------------------
   Insights (Fase 9)
-------------------------- */
export interface ExpertInsights {
    strongestSpecialty: string;
    mainRiskArea: string;
    recommendedAction: string;
}

/* ============================================================
   FASE 11: REAL-TIME MESSAGING
   ============================================================ */

/* -------------------------
   Lead Message (Phase 11)
-------------------------- */
export interface LeadMessage {
    id: string;
    leadId: string;
    message: string;
    isFromExpert: boolean;
    isRead: boolean;
    createdAt: string;
}

/* -------------------------
   Lead With Messages (Phase 11)
-------------------------- */
export interface LeadWithMessages extends ExpertLead {
    messages: LeadMessage[];
    hasUnreadMessages: boolean;
    lastMessageAt?: string;
    unreadCount: number;
}

/* ============================================================
   STORAGE KEYS
   ============================================================ */

const STORAGE_KEYS = {
    APPLICATION: "@kontify_expert_application",
    LEADS: "@kontify_expert_leads",
    NOTIFICATIONS: "@kontify_expert_notifications",
    STATUS: "@kontify_expert_status",
    METRICS: "@kontify_expert_metrics",
    CURRENT_LEAD: "@kontify_current_lead",
    SELECTED_PLAN: "@kontify_selected_plan",
    // Phase 11: Real-Time Messaging
    LEAD_MESSAGES: "@kontify_lead_messages_", // + leadId
    EVENT_LOGS: "@kontify_event_logs",
    LAST_MESSAGE_CHECK: "@kontify_last_message_check",
};

/* ============================================================
   SERVICE CLASS
   ============================================================ */

class ExpertApplicationService {
    /* ============================================================
       FASE 5/6 – APLICACIÓN + LEADS
       ============================================================ */

    async saveApplication(app: ExpertApplication): Promise<void> {
        await AsyncStorage.setItem(STORAGE_KEYS.APPLICATION, JSON.stringify(app));
    }

    async getApplication(): Promise<ExpertApplication | null> {
        const data = await AsyncStorage.getItem(STORAGE_KEYS.APPLICATION);
        return data ? JSON.parse(data) : null;
    }

    /* -------------------------
       Professional Profile Management
    -------------------------- */
    getProfessionalProfile(): ExpertApplication | null {
        // Synchronous method - returns from memory/cache
        // In a real app, this would be managed by state
        return null; // Placeholder - will be managed by component state
    }

    async updateProfessionalProfile(profileData: Partial<ExpertApplication>): Promise<void> {
        const existing = await this.getApplication();
        if (existing) {
            const updated = { ...existing, ...profileData };
            await this.saveApplication(updated);
        } else {
            // If no existing application, create a new one with the profile data
            const newApp: ExpertApplication = {
                id: profileData.id || `app_${Date.now()}`,
                fullName: profileData.fullName || '',
                email: profileData.email || '',
                phone: profileData.phone || '',
                specialty: profileData.specialty || '',
                yearsExperience: profileData.yearsExperience || 0,
                createdAt: new Date().toISOString(),
                ...profileData,
            };
            await this.saveApplication(newApp);
        }
    }

    /* -------------------------
       Crear Lead (desde el chat)
    -------------------------- */
    async createLead(lead: Partial<ExpertLead>): Promise<ExpertLead> {
        const stored = await this.getLeads();
        const newLead: ExpertLead = {
            id: uuidv4(),
            fullName: lead.fullName || "",
            phone: lead.phone || "",
            email: lead.email || "",
            specialty: lead.specialty || "",
            severity: lead.severity || "low",
            caseSummary: lead.caseSummary || "",
            caseNotes: "",
            userContactData: lead.userContactData || null,
            createdAt: new Date().toISOString(),

            /** FASE 10 */
            status: "new",
            archived: false,
            responses: [],
        };

        stored.push(newLead);
        await AsyncStorage.setItem(STORAGE_KEYS.LEADS, JSON.stringify(stored));

        // Crear notificación automática
        await this.createNotification({
            title: "Nuevo lead recibido",
            message: `${newLead.fullName} solicitó asistencia (${newLead.specialty})`,
            severity:
                newLead.severity === "high"
                    ? "high"
                    : newLead.severity === "medium"
                        ? "medium"
                        : "low",
            caseTitle: lead.specialty,
        });

        return newLead;
    }

    /* -------------------------
       Obtener Leads
    -------------------------- */
    async getLeads(): Promise<ExpertLead[]> {
        const data = await AsyncStorage.getItem(STORAGE_KEYS.LEADS);
        return data ? JSON.parse(data) : [];
    }

    /* -------------------------
       Current Lead Management
    -------------------------- */
    getCurrentLead(): ExpertLead | null {
        // Synchronous method - returns from memory/cache
        // In a real app, this would be managed by state
        return null; // Placeholder - will be managed by component state
    }

    async setCurrentLead(lead: ExpertLead | null): Promise<void> {
        if (lead) {
            await AsyncStorage.setItem(STORAGE_KEYS.CURRENT_LEAD, JSON.stringify(lead));
        } else {
            await AsyncStorage.removeItem(STORAGE_KEYS.CURRENT_LEAD);
        }
    }

    async loadCurrentLead(): Promise<ExpertLead | null> {
        const data = await AsyncStorage.getItem(STORAGE_KEYS.CURRENT_LEAD);
        return data ? JSON.parse(data) : null;
    }

    /* -------------------------
       Selected Plan Management
    -------------------------- */
    getSelectedPlan(): string | null {
        // Synchronous method - returns from memory/cache
        return null; // Placeholder - will be managed by component state
    }

    async setSelectedPlan(planId: string | null): Promise<void> {
        if (planId) {
            await AsyncStorage.setItem(STORAGE_KEYS.SELECTED_PLAN, planId);
        } else {
            await AsyncStorage.removeItem(STORAGE_KEYS.SELECTED_PLAN);
        }
    }

    async loadSelectedPlan(): Promise<string | null> {
        return await AsyncStorage.getItem(STORAGE_KEYS.SELECTED_PLAN);
    }

    /* ============================================================
       FASE 10 – LEAD MANAGEMENT
       ============================================================ */

    async updateLeadStatus(id: string, status: LeadStatus): Promise<void> {
        const leads = await this.getLeads();
        const updated = leads.map((l) =>
            l.id === id ? { ...l, status } : l
        );
        await AsyncStorage.setItem(STORAGE_KEYS.LEADS, JSON.stringify(updated));
    }

    async archiveLead(id: string): Promise<void> {
        const leads = await this.getLeads();
        const updated = leads.map((l) =>
            l.id === id ? { ...l, archived: true } : l
        );
        await AsyncStorage.setItem(STORAGE_KEYS.LEADS, JSON.stringify(updated));
    }

    async restoreLead(id: string): Promise<void> {
        const leads = await this.getLeads();
        const updated = leads.map((l) =>
            l.id === id ? { ...l, archived: false } : l
        );
        await AsyncStorage.setItem(STORAGE_KEYS.LEADS, JSON.stringify(updated));
    }

    async deleteLead(id: string): Promise<void> {
        const leads = await this.getLeads();
        const filtered = leads.filter((l) => l.id !== id);
        await AsyncStorage.setItem(STORAGE_KEYS.LEADS, JSON.stringify(filtered));
    }

    async addLeadResponse(leadId: string, message: string): Promise<void> {
        const leads = await this.getLeads();
        const updated = leads.map((l) =>
            l.id === leadId
                ? {
                    ...l,
                    responses: [
                        ...l.responses,
                        {
                            id: uuidv4(),
                            leadId,
                            message,
                            createdAt: new Date().toISOString(),
                        },
                    ],
                }
                : l
        );
        await AsyncStorage.setItem(STORAGE_KEYS.LEADS, JSON.stringify(updated));
    }

    async searchLeads(query: string): Promise<ExpertLead[]> {
        const leads = await this.getLeads();
        const q = query.toLowerCase();

        return leads.filter(
            (l) =>
                l.fullName.toLowerCase().includes(q) ||
                l.email.toLowerCase().includes(q) ||
                l.specialty.toLowerCase().includes(q)
        );
    }

    /* ============================================================
       FASE 8 – NOTIFICATIONS + STATUS
       ============================================================ */

    async createNotification(n: Partial<ExpertNotification>): Promise<void> {
        const notifications = await this.getNotifications();
        const newNotif: ExpertNotification = {
            id: uuidv4(),
            title: n.title || "",
            message: n.message || "",
            severity: n.severity || "low",
            createdAt: new Date().toISOString(),
            isRead: false,
            caseTitle: n.caseTitle || "",
        };
        notifications.unshift(newNotif);
        await AsyncStorage.setItem(
            STORAGE_KEYS.NOTIFICATIONS,
            JSON.stringify(notifications)
        );
    }

    async getNotifications(): Promise<ExpertNotification[]> {
        const data = await AsyncStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
        return data ? JSON.parse(data) : [];
    }

    async markNotificationAsRead(id: string): Promise<void> {
        const list = await this.getNotifications();
        const updated = list.map((n) =>
            n.id === id ? { ...n, isRead: true } : n
        );
        await AsyncStorage.setItem(
            STORAGE_KEYS.NOTIFICATIONS,
            JSON.stringify(updated)
        );
    }

    async markAllNotificationsAsRead(): Promise<void> {
        const list = await this.getNotifications();
        const updated = list.map((n) => ({ ...n, isRead: true }));
        await AsyncStorage.setItem(
            STORAGE_KEYS.NOTIFICATIONS,
            JSON.stringify(updated)
        );
    }

    async setStatus(status: ExpertStatus): Promise<void> {
        await AsyncStorage.setItem(STORAGE_KEYS.STATUS, status);
    }

    async getStatus(): Promise<ExpertStatus> {
        const s = await AsyncStorage.getItem(STORAGE_KEYS.STATUS);
        return (s as ExpertStatus) || "offline";
    }

    /* ============================================================
       FASE 9 – METRICS + INSIGHTS
       ============================================================ */

    async calculateMetrics(): Promise<ExpertMetrics> {
        const leads = await this.getLeads();
        const notifications = await this.getNotifications();

        const totalLeads = leads.length;

        const greenCount = notifications.filter((n) => n.severity === "low").length;
        const yellowCount = notifications.filter((n) => n.severity === "medium")
            .length;
        const redCount = notifications.filter((n) => n.severity === "high").length;

        const read = notifications.filter((n) => n.isRead).length;
        const conversionRate =
            notifications.length > 0 ? (read / notifications.length) * 100 : 0;

        const specialties: Record<string, number> = {};
        notifications.forEach((n) => {
            if (n.caseTitle) {
                specialties[n.caseTitle] = (specialties[n.caseTitle] || 0) + 1;
            }
        });

        const sorted = Object.entries(specialties).sort((a, b) => b[1] - a[1]);

        const topSpecialty = sorted[0]?.[0] || "N/A";
        const top3Specialties = sorted.slice(0, 3).map((e) => e[0]);

        const metrics: ExpertMetrics = {
            totalLeads,
            greenCount,
            yellowCount,
            redCount,
            avgResponseTime: 3,
            conversionRate,
            topSpecialty,
            top3Specialties,
            lastUpdated: new Date().toISOString(),
        };

        await AsyncStorage.setItem(STORAGE_KEYS.METRICS, JSON.stringify(metrics));

        return metrics;
    }

    async getMetrics(): Promise<ExpertMetrics | null> {
        const data = await AsyncStorage.getItem(STORAGE_KEYS.METRICS);
        return data ? JSON.parse(data) : null;
    }

    generateInsights(metrics?: ExpertMetrics): ExpertInsights {
        if (!metrics) {
            return {
                strongestSpecialty: "N/A",
                mainRiskArea: "Sin datos",
                recommendedAction: "Aún no hay suficientes leads",
            };
        }

        let risk =
            metrics.redCount > 3
                ? "Riesgo alto"
                : metrics.yellowCount > metrics.greenCount
                    ? "Riesgo moderado"
                    : "Riesgo bajo";

        let action =
            metrics.redCount > 3
                ? "Aumentar disponibilidad"
                : metrics.avgResponseTime > 5
                    ? "Responder más rápido"
                    : "Buen rendimiento";

        return {
            strongestSpecialty: metrics.topSpecialty,
            mainRiskArea: risk,
            recommendedAction: action,
        };
    }

    /* ============================================================
       FASE 11: REAL-TIME MESSAGING
       ============================================================ */

    /**
     * Get all messages for a specific lead
     */
    async getMessagesByLeadId(leadId: string): Promise<LeadMessage[]> {
        try {
            const data = await AsyncStorage.getItem(STORAGE_KEYS.LEAD_MESSAGES + leadId);
            return data ? JSON.parse(data) : [];
        } catch (error) {
            console.error('Error getting messages:', error);
            return [];
        }
    }

    /**
     * Save messages for a specific lead
     */
    private async saveLeadMessages(leadId: string, messages: LeadMessage[]): Promise<void> {
        try {
            await AsyncStorage.setItem(
                STORAGE_KEYS.LEAD_MESSAGES + leadId,
                JSON.stringify(messages)
            );
        } catch (error) {
            console.error('Error saving messages:', error);
        }
    }

    /**
     * Add a message to a lead
     */
    async addMessageToLead(leadId: string, message: string, isFromExpert: boolean): Promise<LeadMessage> {
        const messages = await this.getMessagesByLeadId(leadId);

        const newMessage: LeadMessage = {
            id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            leadId,
            message,
            isFromExpert,
            isRead: isFromExpert, // Expert messages are auto-read
            createdAt: new Date().toISOString(),
        };

        messages.push(newMessage);
        await this.saveLeadMessages(leadId, messages);

        // Update lead's lastResponseAt if from expert
        if (isFromExpert) {
            const lead = await this.getLeadById(leadId);
            if (lead) {
                // Update timestamp (this is handled by addResponseToLead in Phase 10)
                await this.addResponseToLead(leadId, message);
            }
        }

        return newMessage;
    }

    /**
     * Generate realistic message based on specialty
     */
    private generateRealisticMessage(specialty: string): string {
        const templates: Record<string, string[]> = {
            'Derecho Civil': [
                'Hola, necesito más información sobre el contrato que mencioné.',
                '¿Cuándo podríamos agendar una cita para revisar los documentos?',
                'Gracias por la respuesta anterior, tengo otra duda sobre el proceso.',
                '¿Qué documentos adicionales necesito preparar?',
                'Me gustaría saber más sobre los plazos legales.',
            ],
            'Derecho Penal': [
                'Urgente: necesito asesoría sobre mi caso lo antes posible.',
                '¿Qué documentos necesito preparar para la audiencia?',
                'El juicio es la próxima semana, ¿podemos hablar?',
                '¿Cuáles son mis opciones legales en este momento?',
                'Necesito entender mejor las implicaciones de mi situación.',
            ],
            'Derecho Laboral': [
                'Tengo dudas sobre mi finiquito, ¿puede ayudarme?',
                '¿Es legal lo que está haciendo mi empleador?',
                'Necesito asesoría sobre un despido injustificado.',
                '¿Cuánto tiempo tengo para presentar mi demanda?',
                'Me gustaría saber sobre mis derechos laborales.',
            ],
            'Derecho Mercantil': [
                '¿Puede revisar el contrato de sociedad que le envié?',
                'Necesito asesoría para constituir mi empresa.',
                '¿Qué implicaciones fiscales tiene esta operación?',
                'Tengo dudas sobre la cláusula de confidencialidad.',
                '¿Cuál es el mejor esquema legal para mi negocio?',
            ],
            'Derecho Familiar': [
                'Necesito información sobre el proceso de divorcio.',
                '¿Cómo funciona la pensión alimenticia?',
                'Tengo dudas sobre la custodia de mis hijos.',
                '¿Qué documentos necesito para iniciar el trámite?',
                '¿Cuánto tiempo toma el proceso legal?',
            ],
            'Derecho Fiscal': [
                'Tengo problemas con el SAT, ¿puede ayudarme?',
                '¿Cómo puedo regularizar mi situación fiscal?',
                'Necesito asesoría sobre una auditoría.',
                '¿Qué deducciones puedo aplicar en mi declaración?',
                '¿Es posible negociar un plan de pagos con el SAT?',
            ],
        };

        const messages = templates[specialty] || templates['Derecho Civil'];
        return messages[Math.floor(Math.random() * messages.length)];
    }

    /**
     * Simulate incoming message for a lead
     */
    async simulateIncomingMessage(leadId: string, specialty: string): Promise<LeadMessage | null> {
        try {
            const message = this.generateRealisticMessage(specialty);
            const newMessage = await this.addMessageToLead(leadId, message, false);

            // Log event
            await this.logEvent('message_received', leadId);

            return newMessage;
        } catch (error) {
            console.error('Error simulating message:', error);
            return null;
        }
    }

    /**
     * Simulate incoming messages based on expert status
     */
    async simulateIncomingMessages(status: ExpertStatus): Promise<void> {
        if (status === 'offline') return;

        const leads = await this.getLeads();
        const activeLeads = leads.filter(l => l.status !== 'closed' && !l.archived);

        const probability = status === 'online' ? 0.2 : 0.1; // 20% online, 10% busy

        for (const lead of activeLeads) {
            if (Math.random() < probability) {
                await this.simulateIncomingMessage(lead.id, lead.specialty);
            }
        }

        // Update last check timestamp
        await AsyncStorage.setItem(
            STORAGE_KEYS.LAST_MESSAGE_CHECK,
            new Date().toISOString()
        );
    }

    /**
     * Get count of unread messages
     */
    async getUnreadMessageCount(): Promise<number> {
        try {
            const leads = await this.getLeads();
            let count = 0;

            for (const lead of leads) {
                const messages = await this.getMessagesByLeadId(lead.id);
                const unread = messages.filter(m => !m.isRead && !m.isFromExpert);
                count += unread.length;
            }

            return count;
        } catch (error) {
            console.error('Error getting unread count:', error);
            return 0;
        }
    }

    /**
     * Get leads with new messages
     */
    async getLeadsWithNewMessages(): Promise<string[]> {
        try {
            const leads = await this.getLeads();
            const leadsWithNew: string[] = [];

            for (const lead of leads) {
                const messages = await this.getMessagesByLeadId(lead.id);
                const hasUnread = messages.some(m => !m.isRead && !m.isFromExpert);
                if (hasUnread) {
                    leadsWithNew.push(lead.id);
                }
            }

            return leadsWithNew;
        } catch (error) {
            console.error('Error getting leads with new messages:', error);
            return [];
        }
    }

    /**
     * Mark all messages of a lead as read
     */
    async markLeadMessagesAsRead(leadId: string): Promise<void> {
        try {
            const messages = await this.getMessagesByLeadId(leadId);
            const updated = messages.map(m => ({ ...m, isRead: true }));
            await this.saveLeadMessages(leadId, updated);
        } catch (error) {
            console.error('Error marking messages as read:', error);
        }
    }

    /**
     * Mark all messages as read
     */
    async markAllMessagesAsRead(): Promise<void> {
        try {
            const leads = await this.getLeads();
            for (const lead of leads) {
                await this.markLeadMessagesAsRead(lead.id);
            }
        } catch (error) {
            console.error('Error marking all messages as read:', error);
        }
    }

    /**
     * Get unread count for a specific lead
     */
    async getLeadUnreadCount(leadId: string): Promise<number> {
        try {
            const messages = await this.getMessagesByLeadId(leadId);
            return messages.filter(m => !m.isRead && !m.isFromExpert).length;
        } catch (error) {
            console.error('Error getting lead unread count:', error);
            return 0;
        }
    }

    /**
     * Log event for debugging/analytics
     */
    private async logEvent(eventType: string, leadId?: string): Promise<void> {
        try {
            const logsData = await AsyncStorage.getItem(STORAGE_KEYS.EVENT_LOGS);
            const logs = logsData ? JSON.parse(logsData) : [];

            logs.push({
                type: eventType,
                leadId,
                timestamp: new Date().toISOString(),
            });

            // Keep only last 100 events
            const trimmed = logs.slice(-100);

            await AsyncStorage.setItem(STORAGE_KEYS.EVENT_LOGS, JSON.stringify(trimmed));
        } catch (error) {
            console.error('Error logging event:', error);
        }
    }

    /**
     * Get last message check timestamp
     */
    async getLastMessageCheck(): Promise<string | null> {
        try {
            return await AsyncStorage.getItem(STORAGE_KEYS.LAST_MESSAGE_CHECK);
        } catch (error) {
            console.error('Error getting last check:', error);
            return null;
        }
    }
}

/* ============================================================
   EXPORT INSTANCE
   ============================================================ */

export const expertApplicationService = new ExpertApplicationService();
