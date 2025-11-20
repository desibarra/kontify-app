// Expert Application Service
// Handles expert registration, lead capture, and application management

export interface ExpertLead {
    id?: string;
    fullName: string;
    email: string;
    phone: string;
    specialty: string;
    createdAt?: Date;
    status?: 'pending' | 'contacted' | 'approved' | 'rejected';
    selectedPlan?: string; // Plan selected during registration
}

export interface ExpertApplication extends ExpertLead {
    // Professional data (added in professional-form.tsx)
    cedula?: string;
    yearsOfExperience?: number;
    specializations?: string[];
    services?: string[];
    availability?: string;
    hourlyRate?: number;
    documents?: string[];
    bio?: string;
    city?: string;
    state?: string;
    website?: string;
    linkedin?: string;
    facebookPage?: string;
    rfc?: string;
}

class ExpertApplicationService {
    private leads: ExpertLead[] = [];
    private applications: ExpertApplication[] = [];
    private currentLead: ExpertLead | null = null;
    private selectedPlan: string | null = null;

    /**
     * Set selected plan (temporary storage before lead creation)
     */
    setSelectedPlan(planId: string): void {
        this.selectedPlan = planId;
    }

    /**
     * Get selected plan
     */
    getSelectedPlan(): string | null {
        return this.selectedPlan;
    }

    /**
     * Set current lead (for multi-step registration)
     */
    setCurrentLead(lead: ExpertLead): void {
        this.currentLead = lead;
    }

    /**
     * Get current lead
     */
    getCurrentLead(): ExpertLead | null {
        return this.currentLead;
    }

    /**
     * Create a new expert lead (basic registration)
     * 
     * MOCK IMPLEMENTATION - Replace with real API call when backend is ready
     * Expected API endpoint: POST /api/expert-leads
     * Expected request body: { fullName, email, phone, specialty, selectedPlan }
     * Expected response: { id, ...leadData, createdAt, status }
     */
    async createLead(leadData: Omit<ExpertLead, 'id' | 'createdAt'>): Promise<ExpertLead> {
        // MOCK: In-memory storage (replace with API call)
        const newLead: ExpertLead = {
            id: `lead_${Date.now()}`,
            ...leadData,
            selectedPlan: this.selectedPlan || undefined,
            createdAt: new Date(),
            status: 'pending',
        };

        this.leads.push(newLead);
        this.currentLead = newLead;

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));

        return newLead;
    }

    /**
     * Get lead by email
     */
    async getLeadByEmail(email: string): Promise<ExpertLead | null> {
        const lead = this.leads.find(l => l.email.toLowerCase() === email.toLowerCase());
        return lead || null;
    }

    /**
     * Update lead to full application (after professional form)
     */
    async upgradeToApplication(
        leadId: string,
        professionalData: Partial<ExpertApplication>
    ): Promise<ExpertApplication> {
        const lead = this.leads.find(l => l.id === leadId);

        if (!lead) {
            throw new Error('Lead not found');
        }

        const application: ExpertApplication = {
            ...lead,
            ...professionalData,
        };

        this.applications.push(application);

        // Remove from leads
        this.leads = this.leads.filter(l => l.id !== leadId);

        await new Promise(resolve => setTimeout(resolve, 500));

        return application;
    }

    /**
     * Get all leads (for admin)
     */
    async getAllLeads(): Promise<ExpertLead[]> {
        return this.leads;
    }

    /**
     * Get all applications (for admin)
     */
    async getAllApplications(): Promise<ExpertApplication[]> {
        return this.applications;
    }

    /**
     * Approve application
     */
    async approveApplication(applicationId: string): Promise<void> {
        const app = this.applications.find(a => a.id === applicationId);
        if (app) {
            app.status = 'approved';
        }
    }

    /**
     * Reject application
     */
    async rejectApplication(applicationId: string): Promise<void> {
        const app = this.applications.find(a => a.id === applicationId);
        if (app) {
            app.status = 'rejected';
        }
    }

    /**
     * Update professional profile data for current lead
     */
    async updateProfessionalProfile(profileData: Partial<ExpertApplication>): Promise<void> {
        if (!this.currentLead) {
            throw new Error('No current lead found');
        }

        // Update current lead with professional data
        Object.assign(this.currentLead, profileData);

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
    }

    /**
     * Get professional profile data from current lead
     */
    getProfessionalProfile(): Partial<ExpertApplication> | null {
        return this.currentLead;
    }

    /**
     * Get profile completion status
     */
    getProfileCompletionStatus(): { isComplete: boolean; missingFields: string[] } {
        if (!this.currentLead) {
            return { isComplete: false, missingFields: ['No lead found'] };
        }

        const requiredFields = [
            'fullName',
            'email',
            'phone',
            'specialty',
            'cedula',
            'yearsOfExperience',
            'specializations',
            'services',
            'bio',
            'city',
            'state',
        ];

        const missingFields: string[] = [];

        requiredFields.forEach(field => {
            const value = (this.currentLead as any)?.[field];
            if (!value || (Array.isArray(value) && value.length === 0)) {
                missingFields.push(field);
            }
        });

        return {
            isComplete: missingFields.length === 0,
            missingFields,
        };
    }

    /**
     * Logout expert (clear current lead)
     */
    logoutExpert(): void {
        this.currentLead = null;
        this.selectedPlan = null;
    }
}

export const expertApplicationService = new ExpertApplicationService();
