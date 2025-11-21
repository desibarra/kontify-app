import React, { createContext, useState, ReactNode, useEffect } from 'react';
import { User, UserRole } from '../constants/Types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  switchRole: (role: UserRole) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

const mockUsers: Record<UserRole, User> = {
  entrepreneur: {
    id: 'user_entrepreneur',
    name: 'Carlos Empresario',
    email: 'empresario@example.com',
    role: 'entrepreneur',
    avatar: 'https://i.pravatar.cc/150?img=33',
    phone: '+52 55 1111 2222',
    company: 'Mi Empresa PYME',
    createdAt: new Date('2024-01-10'),
  },
  expert: {
    id: 'user_expert',
    name: 'Ana Experta',
    email: 'experta@example.com',
    role: 'expert',
    avatar: 'https://i.pravatar.cc/150?img=44',
    phone: '+52 55 3333 4444',
    createdAt: new Date('2023-06-15'),
  },
  admin: {
    id: 'user_admin',
    name: 'Admin Kontify',
    email: 'admin@kontify.com',
    role: 'admin',
    avatar: 'https://i.pravatar.cc/150?img=66',
    createdAt: new Date('2023-01-01'),
  },
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(mockUsers.entrepreneur);

  const login = async (email: string, password: string): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Mock login - accept any credentials
        setUser(mockUsers.entrepreneur);
        resolve(true);
      }, 800);
    });
  };

  const logout = () => {
    setUser(null);
  };

  const switchRole = (role: UserRole) => {
    setUser(mockUsers[role]);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: user !== null,
        login,
        logout,
        switchRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}