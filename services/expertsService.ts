import { Expert, Specialty, ServiceType } from '../constants/Types';

const mockExperts: Expert[] = [
  {
    id: '1',
    name: 'María González Ruiz',
    email: 'maria.gonzalez@example.com',
    role: 'expert',
    avatar: 'https://i.pravatar.cc/150?img=1',
    phone: '+52 55 1234 5678',
    specialties: ['IVA', 'ISR', 'Declaraciones'],
    services: ['Consultoría General', 'Revisión de Declaraciones', 'Optimización Fiscal'],
    hourlyRate: 800,
    rating: 4.9,
    reviewCount: 47,
    description: 'Contadora Pública Certificada con 12 años de experiencia en asesoría fiscal para PYMEs. Especializada en optimización de cargas tributarias y cumplimiento normativo.',
    experience: '12 años en el sector fiscal',
    certifications: ['Contador Público Certificado', 'Especialista en Derecho Fiscal'],
    availability: ['Lunes a Viernes 9:00-18:00'],
    verified: true,
    approved: true,
    createdAt: new Date('2023-01-15'),
    testimonials: [
      {
        id: 't1',
        clientName: 'Carlos Méndez',
        rating: 5,
        comment: 'Excelente profesional, me ayudó a reducir mi carga fiscal de manera legal y eficiente.',
        date: new Date('2024-10-15'),
      },
      {
        id: 't2',
        clientName: 'Ana Torres',
        rating: 5,
        comment: 'Muy clara en sus explicaciones y siempre disponible para resolver dudas.',
        date: new Date('2024-09-20'),
      },
    ],
  },
  {
    id: '2',
    name: 'Roberto Sánchez López',
    email: 'roberto.sanchez@example.com',
    role: 'expert',
    avatar: 'https://i.pravatar.cc/150?img=12',
    phone: '+52 55 8765 4321',
    specialties: ['Nómina', 'ISR', 'Auditoría'],
    services: ['Consultoría General', 'Asesoría en Auditoría', 'Capacitación'],
    hourlyRate: 950,
    rating: 4.8,
    reviewCount: 62,
    description: 'Experto en nóminas y seguridad social con enfoque en empresas medianas y grandes. Más de 15 años asesorando en cumplimiento laboral y fiscal.',
    experience: '15 años en auditoría y nóminas',
    certifications: ['CPA', 'Certificación en IMSS', 'Auditor Interno'],
    availability: ['Lunes a Viernes 10:00-19:00', 'Sábados 10:00-14:00'],
    verified: true,
    approved: true,
    createdAt: new Date('2023-03-10'),
    testimonials: [
      {
        id: 't3',
        clientName: 'Laura Ramírez',
        rating: 5,
        comment: 'Resolvió todas nuestras dudas sobre nóminas y nos ahorró muchos dolores de cabeza.',
        date: new Date('2024-10-01'),
      },
    ],
  },
  {
    id: '3',
    name: 'Patricia Hernández Cruz',
    email: 'patricia.hernandez@example.com',
    role: 'expert',
    avatar: 'https://i.pravatar.cc/150?img=5',
    phone: '+52 55 2468 1357',
    specialties: ['Facturación Electrónica', 'Deducciones', 'IVA'],
    services: ['Consultoría General', 'Capacitación', 'Optimización Fiscal'],
    hourlyRate: 750,
    rating: 4.7,
    reviewCount: 38,
    description: 'Especialista en facturación electrónica y deducciones fiscales. Ayudo a empresarios a aprovechar al máximo los beneficios fiscales disponibles.',
    experience: '10 años en consultoría fiscal',
    certifications: ['Contador Público', 'Certificación SAT'],
    availability: ['Lunes a Viernes 9:00-17:00'],
    verified: true,
    approved: true,
    createdAt: new Date('2023-05-20'),
    testimonials: [
      {
        id: 't4',
        clientName: 'Jorge Martínez',
        rating: 5,
        comment: 'Me enseñó a facturar correctamente y a identificar deducciones que desconocía.',
        date: new Date('2024-09-10'),
      },
    ],
  },
  {
    id: '4',
    name: 'Luis Fernando Morales',
    email: 'luis.morales@example.com',
    role: 'expert',
    avatar: 'https://i.pravatar.cc/150?img=8',
    phone: '+52 55 9876 5432',
    specialties: ['Planeación Fiscal', 'ISR', 'Declaraciones'],
    services: ['Optimización Fiscal', 'Resolución de Controversias', 'Consultoría General'],
    hourlyRate: 1100,
    rating: 4.9,
    reviewCount: 85,
    description: 'Más de 20 años de experiencia en planeación fiscal estratégica para empresas. Especialista en controversias fiscales y defensa ante el SAT.',
    experience: '20 años en derecho fiscal',
    certifications: ['Licenciado en Derecho', 'Maestría en Derecho Fiscal', 'Certificación SAT'],
    availability: ['Lunes a Viernes 11:00-20:00'],
    verified: true,
    approved: true,
    createdAt: new Date('2023-02-01'),
    testimonials: [
      {
        id: 't5',
        clientName: 'Mariana Silva',
        rating: 5,
        comment: 'Ganamos un caso ante el SAT gracias a su asesoría experta. Altamente recomendado.',
        date: new Date('2024-08-25'),
      },
    ],
  },
];

export const expertsService = {
  getAllExperts: async (): Promise<Expert[]> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockExperts.filter(e => e.approved)), 300);
    });
  },

  getExpertById: async (id: string): Promise<Expert | null> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const expert = mockExperts.find(e => e.id === id);
        resolve(expert || null);
      }, 200);
    });
  },

  searchExperts: async (
    query: string,
    specialty?: Specialty,
    service?: ServiceType
  ): Promise<Expert[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        let filtered = mockExperts.filter(e => e.approved);

        if (query) {
          const lowerQuery = query.toLowerCase();
          filtered = filtered.filter(
            e =>
              e.name.toLowerCase().includes(lowerQuery) ||
              e.description.toLowerCase().includes(lowerQuery) ||
              e.specialties.some(s => s.toLowerCase().includes(lowerQuery))
          );
        }

        if (specialty) {
          filtered = filtered.filter(e => e.specialties.includes(specialty));
        }

        if (service) {
          filtered = filtered.filter(e => e.services.includes(service));
        }

        resolve(filtered);
      }, 300);
    });
  },

  getPendingExperts: async (): Promise<Expert[]> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockExperts.filter(e => !e.approved)), 300);
    });
  },

  approveExpert: async (expertId: string): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const expert = mockExperts.find(e => e.id === expertId);
        if (expert) {
          expert.approved = true;
          resolve(true);
        } else {
          resolve(false);
        }
      }, 500);
    });
  },
};