import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole, Permission } from '@/types';
import { mockAuthService } from '@/services/auth/authService';
import { DEMO_USERS } from '@/mock/users';
import { hasPermission as checkPermission, hasAnyPermission as checkAnyPermission } from '@/permissions/access';

interface AuthContextType {
  user: User;
  role: UserRole;
  permissions: Permission[];
  isAuthenticated: boolean;
  hasPermission: (permission: Permission) => boolean;
  hasAnyPermission: (permissions: Permission[]) => boolean;
  switchDemoRole: (role: UserRole) => Promise<void>;
  login: (email: string, shopCode: string) => Promise<boolean>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>(DEMO_USERS.OWNER);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);

  useEffect(() => {
    mockAuthService.getCurrentUser().then((u) => {
      if (u) {
        setUser(u);
        setIsAuthenticated(true);
      }
    });
  }, []);

  const handleHasPermission = (permission: Permission): boolean => {
    return checkPermission(user?.permissions, permission);
  };

  const handleHasAnyPermission = (permissions: Permission[]): boolean => {
    return checkAnyPermission(user?.permissions, permissions);
  };

  const switchDemoRole = async (newRole: UserRole) => {
    const updatedUser = await mockAuthService.switchRole(newRole);
    setUser(updatedUser);
  };

  const login = async (email: string, shopCode: string): Promise<boolean> => {
    const res = await mockAuthService.login(email, shopCode);
    setUser(res.user);
    setIsAuthenticated(true);
    return true;
  };

  const logout = async () => {
    await mockAuthService.logout();
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user.role,
        permissions: user.permissions,
        isAuthenticated,
        hasPermission: handleHasPermission,
        hasAnyPermission: handleHasAnyPermission,
        switchDemoRole,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
