"use client";

import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import { logger } from '@/shared/lib/logger';

import { tokenManager } from './tokenManager';
import { UserProfile } from '../api/types';
import { DEV_CONFIG } from '../constants/config';
import { apiClient } from '@/features/tanstack-query-api';
import { AUTH_ENDPOINTS } from '../api/constants';

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: Error | null;
  login: (username: string, password: string) => Promise<UserProfile>;
  logout: () => Promise<void>;
  refreshUserProfile: () => Promise<UserProfile | null>;
  
  // Legacy RBAC methods for backward compatibility
  // These methods will use the new RBAC feature internally
  hasRole: (role: string) => boolean;
  hasPermission: (permission: string) => boolean;
  hasAccess: (roles: string[], permissions: string[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: React.ReactNode;
}

// Check browser storage for existing auth state
const checkInitialAuthState = (): boolean => {
  // In development mode, bypass auth if configured
  if (process.env.NODE_ENV === 'development' && DEV_CONFIG.bypassAuth) {
    return true;
  }
  
  if (typeof window === 'undefined') return false;
  
  const token = localStorage.getItem('auth_token') || localStorage.getItem('access_token');
  if (!token) return false;
  
  // Check if token is expired (if expiry is stored)
  const expiry = localStorage.getItem('token_expiry');
  if (expiry && Date.now() > parseInt(expiry)) {
    return false;
  }
  
  return !!token;
};

// Extracts user roles from JWT token
const extractRolesFromToken = (token: string): string[] => {
  try {
    // Extract the payload part of the JWT
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    const payload = JSON.parse(jsonPayload);
    
    // Extract roles from token payload
    if (payload.roles && Array.isArray(payload.roles)) {
      return payload.roles;
    }
    
    // Or try to get from authorities if roles doesn't exist
    if (payload.authorities && Array.isArray(payload.authorities)) {
      return payload.authorities
        .filter(auth => auth.startsWith('ROLE_'))
        .map(role => role.replace('ROLE_', ''));
    }
    
    return [];
  } catch (error) {
    logger.error('Failed to extract roles from token', { error });
    return [];
  }
};

// Create a mock user for development mode
const createMockUser = (): UserProfile => {
return {
id: 'dev-user-id',
username: 'developer',
email: 'dev@example.com',
firstName: 'Dev',
lastName: 'User',
roles: ['ADMIN', 'USER'],
permissions: ['view_dashboard', 'manage_users', 'manage_exams', 'exams:view', 'exams:edit', 'exams:manage-questions'],
userType: 'ADMIN'
};
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  // Use mock user in development if auth bypass is enabled
  const initialUser = (process.env.NODE_ENV === 'development' && DEV_CONFIG.bypassAuth) 
    ? createMockUser() 
    : null;
    
  const [user, setUser] = useState<UserProfile | null>(initialUser);
  const [isLoading, setIsLoading] = useState<boolean>(!initialUser);
  const [error, setError] = useState<Error | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(checkInitialAuthState());
  const profileRequestRef = useRef<Promise<UserProfile | null> | null>(null);

  // Implement a memoized fetchProfile function that uses a ref to store the promise
  // This ensures multiple concurrent calls get the same promise
  const fetchProfile = useCallback(async (): Promise<UserProfile | null> => {
    // In development mode with auth bypass, return the mock user
    if (process.env.NODE_ENV === 'development' && DEV_CONFIG.bypassAuth) {
      const mockUser = createMockUser();
      setUser(mockUser);
      setIsAuthenticated(true);
      return mockUser;
    }
    
    // If a profile request is already in progress, return that promise
    if (profileRequestRef.current) {
      return profileRequestRef.current;
    }

    // Create a new promise for the profile request
    profileRequestRef.current = (async () => {
      try {
        if (!tokenManager.hasToken()) {
          setIsAuthenticated(false);
          return null;
        }

        // Get current token
        const token = tokenManager.getToken();
        
        // Extract roles from token
        const rolesFromToken = token ? extractRolesFromToken(token) : [];
        
        // Use apiClient directly instead of React Query hooks
        const response = await apiClient.get(AUTH_ENDPOINTS.profile);
        
        // Handle 403 errors by clearing auth state
        if (response.status === 403) {
          logger.warn('Profile access forbidden, clearing auth state');
          tokenManager.removeToken();
          tokenManager.removeRefreshToken();
          setIsAuthenticated(false);
          return null;
        }
        
        if (!response.data) {
          throw new Error('No profile data returned');
        }
        
        // Convert to UserProfile format
        const profile: UserProfile = {
          id: response.data.id,
          username: response.data.email,
          email: response.data.email,
          firstName: response.data.firstName,
          lastName: response.data.lastName,
          roles: response.data.roles || rolesFromToken,
          permissions: response.data.permissions || [],
          userType: response.data.userType || null
        };
        
        setUser(profile);
        setIsAuthenticated(true);
        return profile;
      } catch (err) {
        logger.error('Error fetching user profile', { error: err });
        setError(err instanceof Error ? err : new Error('Failed to fetch user profile'));
        // Only set isAuthenticated to false if it's an auth error (401, 403)
        if (err instanceof Error && 
            (err.message.includes('401') || 
             err.message.includes('403') || 
             err.message.includes('Unauthorized') || 
             err.message.includes('Forbidden'))) {
          setIsAuthenticated(false);
          // Clear tokens on auth errors
          tokenManager.removeToken();
          tokenManager.removeRefreshToken();
        }
        return null;
      } finally {
        // Clear the request ref when done
        profileRequestRef.current = null;
      }
    })();

    return profileRequestRef.current;
  }, []);

  // Initialize auth state on mount
  useEffect(() => {
    // Skip initialization in development mode with auth bypass
    if (process.env.NODE_ENV === 'development' && DEV_CONFIG.bypassAuth) {
      setIsLoading(false);
      return;
    }
    
    const initializeAuth = async () => {
      setIsLoading(true);
      setError(null);

      try {
        if (tokenManager.hasToken()) {
          try {
            await fetchProfile();
          } catch (profileErr) {
            // If profile fetch fails, just set authenticated to false
            logger.warn('Failed to fetch profile on init, clearing auth state', { error: profileErr });
            setIsAuthenticated(false);
            tokenManager.removeToken();
            tokenManager.removeRefreshToken();
          }
        } else {
          setIsAuthenticated(false);
        }
      } catch (err) {
        logger.error('Authentication initialization error', { error: err });
        setError(err instanceof Error ? err : new Error('Authentication failed'));
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
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
  }, [fetchProfile]);

  // Login function
  const login = async (username: string, password: string): Promise<UserProfile> => {
    // In development mode with auth bypass, return the mock user
    if (process.env.NODE_ENV === 'development' && DEV_CONFIG.bypassAuth) {
      const mockUser = createMockUser();
      setUser(mockUser);
      setIsAuthenticated(true);
      return mockUser;
    }
    
    setIsLoading(true);
    setError(null);

    try {
      // Use apiClient directly instead of React Query hooks
      const response = await apiClient.post(AUTH_ENDPOINTS.login, { 
        emailAddress: username,
        password 
      });
      
      const data = response.data;
      
      if (!data || !data.tokens || !data.user) {
        throw new Error('Invalid login response');
      }
      
      // Store tokens
      const { tokens, user: userData } = data;
      
      // Store tokens in tokenManager and localStorage
      tokenManager.setToken(tokens.accessToken);
      tokenManager.setRefreshToken(tokens.refreshToken);
      tokenManager.setTokenExpiry(Date.now() + (tokens.expiresIn * 1000));
      
      // Get roles from token if not in user data
      const rolesFromToken = extractRolesFromToken(tokens.accessToken);
      
      // Create user profile
      const userProfile: UserProfile = {
        id: userData.id,
        username: userData.email,
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        roles: userData.roles || rolesFromToken,
        permissions: userData.permissions || [],
        userType: userData.userType || null
      };
      
      setUser(userProfile);
      setIsAuthenticated(true);
      
      return userProfile;
    } catch (err) {
      logger.error('Login error', { error: err });
      const error = err instanceof Error ? err : new Error('Login failed');
      setError(error);
      setIsAuthenticated(false);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = async (): Promise<void> => {
    // In development mode with auth bypass, just maintain the mock user
    if (process.env.NODE_ENV === 'development' && DEV_CONFIG.bypassAuth) {
      return;
    }
    
    try {
      // Use apiClient directly instead of React Query hooks
      await apiClient.post(AUTH_ENDPOINTS.logout);
    } catch (err) {
      logger.error('Logout error', { error: err });
    } finally {
      setUser(null);
      setIsAuthenticated(false);
      // Clear tokens
      tokenManager.removeToken();
      tokenManager.removeRefreshToken();
    }
  };

  // Function to refresh user profile
  const refreshUserProfile = async (): Promise<UserProfile | null> => {
    return fetchProfile();
  };

  // RBAC helper functions for backward compatibility
  const hasRole = useCallback((role: string): boolean => {
    // In development mode with auth bypass, assume all roles for convenience
    if (process.env.NODE_ENV === 'development' && DEV_CONFIG.bypassAuth) {
      return true;
    }
    
    if (!user || !user.roles) return false;
    return user.roles.includes(role);
  }, [user]);
  
  const hasPermission = useCallback((permission: string): boolean => {
    // In development mode with auth bypass, assume all permissions for convenience
    if (process.env.NODE_ENV === 'development' && DEV_CONFIG.bypassAuth) {
      return true;
    }
    
    if (!user || !user.permissions) return false;
    return user.permissions.includes(permission);
  }, [user]);
  
  const hasAccess = useCallback((roles: string[] = [], permissions: string[] = []): boolean => {
    // In development mode with auth bypass, assume all access for convenience
    if (process.env.NODE_ENV === 'development' && DEV_CONFIG.bypassAuth) {
      return true;
    }
    
    if (!user) return false;
    
    // If no roles or permissions specified, deny access
    if (roles.length === 0 && permissions.length === 0) return false;
    
    // Check roles
    const hasRequiredRole = roles.length === 0 || roles.some(role => hasRole(role));
    
    // Check permissions
    const hasRequiredPermission = permissions.length === 0 || 
      permissions.some(permission => hasPermission(permission));
      
    // User must satisfy both role and permission requirements
    return hasRequiredRole && hasRequiredPermission;
  }, [user, hasRole, hasPermission]);
  
  const contextValue: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    logout,
    refreshUserProfile,
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

// Internal hook for consuming auth context
const useAuthContext = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};

export { AuthContext, AuthProvider, useAuthContext };
