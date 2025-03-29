"use client";

import React, { createContext, useContext, useEffect } from 'react';
import { logger } from '@/shared/lib/logger';
import { useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '../state';
import { tokenManager } from './tokenManager';
import { UserProfile } from '../types';
import { DEV_CONFIG } from '../constants/config';

/**
 * Auth Context Type Definition
 * Defines the shape of the auth context data and methods
 */
interface AuthContextType {
  /** The current authenticated user profile */
  user: UserProfile | null;
  /** Whether the user is authenticated */
  isAuthenticated: boolean;
  /** Whether authentication is in process */
  isLoading: boolean;
  /** Any authentication error */
  error: Error | null;
  /** Function to log in a user */
  login: (username: string, password: string, deviceInfo?: Record<string, string>) => Promise<UserProfile>;
  /** Function to log out the current user */
  logout: () => Promise<void>;
  /** Function to refresh the user profile */
  refreshUserProfile: () => Promise<UserProfile | null>;
  /** Function to set the user */
  setUser: (user: UserProfile | null) => void;
  /** Function to set authentication state */
  setIsAuthenticated: (value: boolean) => void;
  
  // RBAC methods
  /** Check if the user has a specific role */
  hasRole: (role: string) => boolean;
  /** Check if the user has a specific permission */
  hasPermission: (permission: string) => boolean;
  /** Check if the user has access based on roles and permissions */
  hasAccess: (roles: string[], permissions: string[]) => boolean;
}

// Create context with undefined default value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Auth Provider Props
 */
interface AuthProviderProps {
  /** Child components that will have access to the auth context */
  children: React.ReactNode;
}

/**
 * Auth Provider Component
 * 
 * Manages authentication state and provides auth-related functionality
 * to all child components via React Context
 * 
 * Note: This provider now uses the Zustand store for state management
 * for better performance and state management patterns.
 */
const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const queryClient = useQueryClient();
  
  // Get all state and actions from the Zustand store
  const { 
    user, 
    isAuthenticated, 
    isLoading, 
    error, 
    setUser, 
    setIsAuthenticated,
    login, 
    logout, 
    refreshUserProfile,
    hasRole,
    hasPermission,
    hasAccess
  } = useAuthStore();

  // Initialize auth state on mount
  useEffect(() => {
    // Skip initialization in development mode with auth bypass
    if (process.env.NODE_ENV === 'development' && DEV_CONFIG.bypassAuth) {
      return;
    }
    
    const initializeAuth = async () => {
      try {
        await refreshUserProfile();
      } catch (err) {
        logger.error('Authentication initialization error', { error: err });
      }
    };

    initializeAuth();
    
    // Set up an interval to check token expiration
    const checkTokenInterval = setInterval(() => {
      // Skip token checks in development mode with auth bypass
      if (process.env.NODE_ENV === 'development' && DEV_CONFIG.bypassAuth) {
        return;
      }
      
      const isValid = tokenManager.hasToken();
      if (!isValid && isAuthenticated) {
        setIsAuthenticated(false);
        setUser(null);
      }
    }, 60000); // Check every minute
    
    return () => clearInterval(checkTokenInterval);
  }, [refreshUserProfile, isAuthenticated, setUser, setIsAuthenticated]);

  // Create the context value from our Zustand store
  const contextValue: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    logout,
    refreshUserProfile,
    setUser,
    setIsAuthenticated,
    hasRole,
    hasPermission,
    hasAccess
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Hook for consuming auth context
 * 
 * @returns Authentication context with all auth-related state and functions
 * @throws Error if used outside of AuthProvider
 * 
 * @deprecated Use the Zustand selectors directly for better performance:
 * - useUser() - Get the current user
 * - useIsAuthenticated() - Check if user is authenticated
 * - useAuthLoading() - Check if auth operations are in progress
 * - useAuthError() - Get any auth error
 * - useRbacHelpers() - Get RBAC helper functions
 * - useAuthActions() - Get auth actions (login, logout, etc.)
 */
const useAuthContext = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};

export { AuthContext, AuthProvider, useAuthContext };