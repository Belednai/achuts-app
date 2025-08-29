// Authentication context for admin system

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import type { User, AuthSession, LoginRequest } from '@/lib/types';
import { authService } from '@/lib/auth';
import { initializeAdminSystem } from '@/lib/seed';

interface AuthContextType {
  user: User | null;
  session: AuthSession | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (request: LoginRequest) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  refreshAuth: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<AuthSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      setIsLoading(true);
      
      console.log('Starting admin system initialization...');
      
      // Initialize admin system if needed
      await initializeAdminSystem();
      
      console.log('Admin system initialization completed');
      
      // Check for existing session
      const currentSession = authService.getValidSession();
      const currentUser = authService.getCurrentUser();
      
      console.log('Current session:', currentSession ? 'Found' : 'None');
      console.log('Current user:', currentUser ? currentUser.username : 'None');
      
      setSession(currentSession);
      setUser(currentUser);
    } catch (error) {
      console.error('Error initializing auth:', error);
      // Even if initialization fails, we should still allow login attempts
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (request: LoginRequest): Promise<{ success: boolean; error?: string }> => {
    try {
      const result = await authService.login(request);
      
      if (result.success && result.session) {
        setSession(result.session);
        setUser(authService.getCurrentUser());
      }
      
      return result;
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        error: 'An unexpected error occurred during login'
      };
    }
  };

  const logout = () => {
    authService.logout();
    setSession(null);
    setUser(null);
  };

  const refreshAuth = () => {
    const currentSession = authService.getValidSession();
    const currentUser = authService.getCurrentUser();
    
    setSession(currentSession);
    setUser(currentUser);
  };

  const value: AuthContextType = {
    user,
    session,
    isAuthenticated: !!session && !!user,
    isLoading,
    login,
    logout,
    refreshAuth
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Higher-order component for route protection
interface RequireAuthProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export function RequireAuth({ children, fallback }: RequireAuthProps) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return fallback || <div>Access denied</div>;
  }

  return <>{children}</>;
}
