import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, UserRole } from '../types';
import { AuthService, ROLE_DEFINITIONS } from '../services/authService';
import { db } from '../lib/database';

interface AuthContextType {
  user: UserProfile | null;
  role: UserRole;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  switchRole: (role: UserRole) => void;
  hasPermission: (permission: string) => boolean;
  availableRoles: { role: UserRole; name: string; email: string }[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const session = AuthService.getCurrentSession();
    setUser(session);
    setIsLoading(false);
  }, []);

  const login = async (email: string, password?: string) => {
    setIsLoading(true);
    const res = AuthService.login(email, password);
    if (res.success && res.user) {
      setUser(res.user);
    }
    setIsLoading(false);
    return res;
  };

  const logout = () => {
    if (user) {
      db.addAuditLog({
        userId: user.id,
        userName: user.fullName,
        userRole: user.role,
        action: 'USER_LOGOUT',
        module: 'Authentication',
        details: 'User logged out of application session.',
      });
    }
    AuthService.clearSession();
    setUser(null);
  };

  const switchRole = (newRole: UserRole) => {
    const profile = AuthService.switchRole(newRole);
    if (profile) {
      setUser({ ...profile });
    }
  };

  const hasPermission = (permission: string): boolean => {
    return AuthService.hasPermission(user, permission);
  };

  const availableRoles = db.getProfiles().map((p) => ({
    role: p.role,
    name: p.fullName,
    email: p.email,
  }));

  const value: AuthContextType = {
    user,
    role: user?.role || 'Employee',
    isAuthenticated: Boolean(user),
    isLoading,
    login,
    logout,
    switchRole,
    hasPermission,
    availableRoles,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
