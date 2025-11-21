import { matchmakingService } from './src/features/ai/services/matchmakingService';
import { Expert } from './src/constants/Types';

const dummyExperts: Expert[] = [
    {
        id: '1',
        name: 'Ana López',
        specialties: ['Contratos comerciales', 'Derecho corporativo'],
        description: 'Abogada especializada en contratos comerciales y derecho corporativo.',
        rating: 4.8,
        hourlyRate: 120,
        avatar: '',
        services: ['Consultoría legal'],
        certifications: ['Licenciatura en Derecho'],
        testimonials: [],
    },
    {
        id: '2',
        name: 'Carlos Pérez',
        specialties: ['Marketing digital', 'SEO'],
        description: 'Especialista en marketing digital y posicionamiento SEO.',
        rating: 4.5,
        hourlyRate: 100,
        avatar: '',
        services: ['Estrategia de marketing'],
        certifications: ['Google Ads Certified'],
        testimonials: [],
    },
];

(async () => {
    const result = await matchmakingService.findBestExpert('Necesito ayuda para crear un contrato de suministro', dummyExperts);
    console.log('Matchmaking result:', result);
})();
