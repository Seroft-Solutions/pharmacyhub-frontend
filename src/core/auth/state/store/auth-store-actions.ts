/**
 * Auth Store Actions
 * 
 * Core authentication actions for the auth store.
 */
import { unwrapAuthResponse } from '@/core/api/utils/transforms';
import { logger } from '@/shared/lib/logger';
import { tokenManager } from '../../core/token';
import { AuthState } from './auth-store-types';
import { createMockUser } from './auth-store-init';
import { StoreApi } from 'zustand';

// Import auth service placeholders
// These will be replaced when we move the API services
const authService = {
  useLogin: () => ({
    mutateAsync: async () => ({})
  }),
  useLogout: () => ({
    mutateAsync: async () => {}
  }),
  queryKeys: {
    all: () => ['auth']
  }
};

const authApiService = {
  getUserProfile: async () => ({}),
  processSocialLogin: async () => ({})
};

// DEV_CONFIG for development mode
const DEV_CONFIG = {
  bypassAuth: process.env.NEXT_PUBLIC_BYPASS_AUTH === 'true'
};

/**
 * Create auth actions using the store API
 * 
 * @param set - Zustand set function
 * @param get - Zustand get function
 * @returns Auth action functions
 */
export const createAuthActions = (
  set: StoreApi<AuthState>['setState'],
  get: StoreApi<AuthState>['getState']
) => ({
  /**
   * Log in a user with username and password
   */
  login: async (username: string, password: string, deviceInfo?: Record<string, string>) => {
    set({ isLoading: true, error: null });
    
    // In development mode with auth bypass, return the mock user
    if (process.env.NODE_ENV === 'development' && DEV_CONFIG.bypassAuth) {
      const mockUser = createMockUser();
      set({ user: mockUser, isAuthenticated: true, isLoading: false });
      return mockUser;
    }
    
    try {
      // Log login attempt for debugging
      logger.debug('[Auth] Login attempt', { 
        emailAddress: username, 
        deviceId: deviceInfo?.deviceId
      });
      
      // Get device info if not provided
      const deviceData = deviceInfo || tokenManager.getAuthDataForLogin();

      // Use the login mutation with device info
      const response = await authService.useLogin().mutateAsync({ 
        emailAddress: username,
        password,
        ...deviceData
      });
      
      // Log successful response
      logger.debug('[Auth] Login response received', { 
        hasData: !!response?.data,
        hasTokens: !!response?.data?.tokens,
        hasUser: !!response?.data?.user
      });
      
      // Unwrap the API response to handle different formats
      const unwrappedResponse = unwrapAuthResponse(response);
      
      // Validate the unwrapped response
      if (!unwrappedResponse || !unwrappedResponse.tokens || !unwrappedResponse.user) {
        logger.error('[Auth] Invalid login response structure after unwrapping', { 
          unwrappedResponse
        });
        throw new Error('Invalid login response: Missing tokens or user data');
      }

      // Initialize token manager with the response
      tokenManager.initializeFromAuthResponse(unwrappedResponse);
      
      // Update auth state
      const userProfile = unwrappedResponse.user;
      set({ 
        user: userProfile,
        isAuthenticated: true,
        isLoading: false
      });
      
      return userProfile;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Login failed');
      logger.error('[Auth] Login error', { error });
      
      set({ 
        isLoading: false, 
        error,
        isAuthenticated: false
      });
      throw error;
    }
  },
  
  /**
   * Log out the current user
   */
  logout: async () => {
    // In development mode with auth bypass, just maintain the mock user
    if (process.env.NODE_ENV === 'development' && DEV_CONFIG.bypassAuth) {
      return;
    }
    
    try {
      // Use the logout mutation
      await authService.useLogout().mutateAsync();
    } catch (err) {
      logger.error('Logout error', { error: err });
    } finally {
      // Reset state
      set({ 
        user: null,
        isAuthenticated: false,
        error: null
      });
      
      // Clear all auth data from storage
      tokenManager.clearAll();
    }
  },
  
  /**
   * Refresh the user profile
   */
  refreshUserProfile: async () => {
    set({ isLoading: true, error: null });
    
    // In development mode with auth bypass, return the mock user
    if (process.env.NODE_ENV === 'development' && DEV_CONFIG.bypassAuth) {
      const mockUser = createMockUser();
      set({ user: mockUser, isAuthenticated: true, isLoading: false });
      return mockUser;
    }
    
    try {
      if (!tokenManager.hasToken()) {
        set({ isLoading: false, user: null, isAuthenticated: false });
        return null;
      }
      
      // Implement actual API call to fetch user profile
      const userProfile = await authApiService.getUserProfile();
      
      if (!userProfile) {
        logger.debug('[Auth] No user profile returned, clearing authentication state');
        set({ isLoading: false, user: null, isAuthenticated: false });
        tokenManager.clearAll();
        return null;
      }
      
      set({ 
        isLoading: false, 
        user: userProfile, 
        isAuthenticated: true 
      });
      
      return userProfile;
    } catch (err) {
      logger.error('Failed to refresh user profile', { error: err });
      
      set({ 
        isLoading: false, 
        error: err instanceof Error ? err : new Error('Failed to refresh profile'),
        user: null,
        isAuthenticated: false
      });
      
      tokenManager.clearAll();
      return null;
    }
  }
});
