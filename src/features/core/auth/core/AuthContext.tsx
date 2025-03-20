"use client";

import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import { logger } from '@/shared/lib/logger';
import { useQueryClient } from '@tanstack/react-query';
import { unwrapAuthResponse, extractUserProfile } from '@/features/core/tanstack-query-api';

import { tokenManager } from './tokenManager';
import { UserProfile } from '../types';
import { DEV_CONFIG } from '../constants/config';
import { authService } from '../api/services/authService';
import { authApiService } from '../api/services/authApiService';

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: Error | null;
  login: (username: string, password: string) => Promise<UserProfile>;
  logout: () => Promise<void>;
  refreshUserProfile: () => Promise<UserProfile | null>;
  
  // RBAC methods for backward compatibility
  hasRole: (role: string) => boolean;
  hasPermission: (permission: string) => boolean;
  hasAccess: (roles: string[], permissions: string[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: React.ReactNode;
}

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

// Check browser storage for existing auth state
const checkInitialAuthState = (): boolean => {
  // In development mode, bypass auth if configured
  if (process.env.NODE_ENV === 'development' && DEV_CONFIG.bypassAuth) {
    return true;
  }
  
  return tokenManager.hasToken();
};

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const queryClient = useQueryClient();
  
  // Use mock user in development if auth bypass is enabled
  const initialUser = (process.env.NODE_ENV === 'development' && DEV_CONFIG.bypassAuth) 
    ? createMockUser() 
    : null;
    
  const [user, setUser] = useState<UserProfile | null>(initialUser);
  const [isLoading, setIsLoading] = useState<boolean>(!initialUser);
  const [error, setError] = useState<Error | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(checkInitialAuthState());
  const profileRequestRef = useRef<Promise<UserProfile | null> | null>(null);

  // Get login and logout mutations from authService
  const { mutateAsync: loginMutation } = authService.useLogin();
  const { mutateAsync: logoutMutation } = authService.useLogout();
  
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

        // Use the direct API service instead of hooks
        const response = await authApiService.getUserProfile();
        const responseData = response.data;

        logger.debug('[Auth] User profile fetch response', { 
          hasData: !!responseData,
          responseType: typeof responseData,
          hasWrappedData: responseData && 'data' in responseData,
          hasWrappedUser: responseData && responseData.data && 'user' in responseData.data
        });
        
        // Extract user profile from response using our utility
        const userData = extractUserProfile<UserProfile>(responseData);
        
        if (!userData) {
          logger.error('[Auth] Failed to extract user profile from response', { responseData });
          throw new Error('Failed to extract user profile from response');
        }
        
        logger.debug('[Auth] Setting user profile', { 
          user: { 
            id: userData.id,
            email: userData.email,
            roles: userData.roles
          }
        });
        
        setUser(userData);
        setIsAuthenticated(true);
        return userData;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        logger.error('[Auth] Error fetching user profile', { 
          error: err,
          message: errorMessage,
          tokenExists: tokenManager.hasToken(),
          tokenExpiry: tokenManager.getTokenExpiry()
        });
        
        setError(err instanceof Error ? err : new Error('Failed to fetch user profile'));
        
        // Set isAuthenticated to false for all profile fetch errors
        // This prevents the app from being in an inconsistent state where
        // isAuthenticated=true but user=null
        logger.debug('[Auth] Clearing auth state due to profile fetch error');
        setIsAuthenticated(false);
        tokenManager.clearAll();
        
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
          const userProfile = await fetchProfile();
          // Only set authenticated if we successfully got a user profile
          if (!userProfile) {
            logger.debug('[Auth] No user profile returned, clearing authentication state');
            setIsAuthenticated(false);
            setUser(null);
            tokenManager.clearAll();
          }
        } else {
          setIsAuthenticated(false);
        }
      } catch (err) {
        logger.error('Authentication initialization error', { error: err });
        setError(err instanceof Error ? err : new Error('Authentication failed'));
        setIsAuthenticated(false);
        setUser(null);
        tokenManager.clearAll();
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
      // Log login attempt for debugging
      logger.debug('[Auth] Login attempt', { emailAddress: username, apiEndpoint: authService.queryKeys.all()[0] });

      // Use the login mutation from authService
      const response = await loginMutation({ 
        emailAddress: username,
        password 
      });
      
      // Log successful response
      logger.debug('[Auth] Login response received', { 
        hasData: !!response?.data,
        hasTokens: !!response?.data?.tokens,
        hasUser: !!response?.data?.user,
        success: response?.success,
        status: response?.status
      });
      
      // Unwrap the API response to handle different formats
      const unwrappedResponse = unwrapAuthResponse(response);
      
      // Validate the unwrapped response
      if (!unwrappedResponse || !unwrappedResponse.tokens || !unwrappedResponse.user) {
        logger.error('[Auth] Invalid login response structure after unwrapping', { 
          originalResponse: response,
          unwrappedResponse
        });
        throw new Error('Invalid login response: Missing tokens or user data in response');
      }

      // User data is now in the unwrapped response
      const userProfile = unwrappedResponse.user;
      
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
      // Use the logout mutation from authService
      await logoutMutation();
    } catch (err) {
      logger.error('Logout error', { error: err });
    } finally {
      // Always reset state regardless of API success
      setUser(null);
      setIsAuthenticated(false);
      
      // Clear all auth data from storage
      tokenManager.clearAll();
      
      // Clear user data from query cache
      queryClient.removeQueries({ 
        queryKey: authService.queryKeys.all()
      });
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
