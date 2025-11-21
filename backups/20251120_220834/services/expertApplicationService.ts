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
   STORAGE KEYS
   ============================================================ */

const STORAGE_KEYS = {
    APPLICATION: "@kontify_expert_application",
    LEADS: "@kontify_expert_leads",
    NOTIFICATIONS: "@kontify_expert_notifications",
    STATUS: "@kontify_expert_status",
    METRICS: "@kontify_expert_metrics",
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
}

/* ============================================================
   EXPORT INSTANCE
   ============================================================ */

export const expertApplicationService = new ExpertApplicationService();
