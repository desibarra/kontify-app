import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { Alert } from 'react-native';
import { useAuth } from '../hooks/useAuth';

interface AuthGuardProps {
    children: React.ReactNode;
    requiredRole?: 'expert' | 'admin' | 'entrepreneur';
    redirectTo?: string;
}

/**
 * Auth Guard Component
 * Protects routes by checking authentication and role
 * Redirects to home if not authenticated or wrong role
 */
export function AuthGuard({ children, requiredRole, redirectTo = '/' }: AuthGuardProps) {
    const { user, isAuthenticated } = useAuth();
    const router = useRouter();

    useEffect(() => {
        // Check if user is authenticated
        if (!isAuthenticated) {
            Alert.alert(
                'Acceso restringido',
                'Debes iniciar sesión para acceder a esta sección.',
                [{ text: 'OK', onPress: () => router.replace(redirectTo) }]
            );
            return;
        }

        // Check if user has required role
        if (requiredRole && user?.role !== requiredRole) {
            Alert.alert(
                'Acceso denegado',
                `Esta sección es solo para ${requiredRole === 'expert' ? 'expertos' : requiredRole === 'admin' ? 'administradores' : 'emprendedores'}.`,
                [{ text: 'OK', onPress: () => router.replace(redirectTo) }]
            );
            return;
        }
    }, [isAuthenticated, user, requiredRole]);

    // Only render children if authenticated and has correct role
    if (!isAuthenticated) {
        return null;
    }

    if (requiredRole && user?.role !== requiredRole) {
        return null;
    }

    return <>{children}</>;
}
