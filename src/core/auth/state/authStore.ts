/**
 * Auth Store
 * 
 * Zustand store for managing authentication state.
 * Provides state, actions, and selector hooks for auth functionality.
 */
import { create } from 'zustand';
import { unwrapAuthResponse } from '@/core/api/utils/transforms';
import { logger } from '@/shared/lib/logger';
import { tokenManager } from '../core/tokenManager';
import { UserProfile, Role, Permission } from '../types';
import { useQueryClient } from '@tanstack/react-query';

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
 * Check browser storage for existing auth state
 */
const checkInitialAuthState = (): boolean => {
  // In development mode, bypass auth if configured
  if (process.env.NODE_ENV === 'development' && DEV_CONFIG.bypassAuth) {
    return true;
  }
  
  return tokenManager.hasToken();
};

/**
 * Create a mock user for development mode
 */
const createMockUser = (): UserProfile => {
  return {
    id: 'dev-user-id',
    username: 'developer',
    email: 'dev@example.com',
    firstName: 'Dev',
    lastName: 'User',
    roles: ['ADMIN', 'USER'],
    permissions: ['view_dashboard', 'manage_users'],
    userType: 'ADMIN'
  };
};

// Define the auth state interface
interface AuthState {
  // State
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: Error | null;
  
  // Actions
  setUser: (user: UserProfile | null) => void;
  setIsAuthenticated: (value: boolean) => void;
  setIsLoading: (value: boolean) => void;
  setError: (error: Error | null) => void;
  login: (username: string, password: string, deviceInfo?: Record<string, string>) => Promise<UserProfile>;
  logout: () => Promise<void>;
  refreshUserProfile: () => Promise<UserProfile | null>;
  
  // RBAC helpers
  hasRole: (role: string) => boolean;
  hasPermission: (permission: string) => boolean;
  hasAccess: (roles: string[], permissions: string[]) => boolean;
}

// Define the initial state
const initialState = {
  user: null,
  isAuthenticated: checkInitialAuthState(),
  isLoading: false,
  error: null,
};

// Create the auth store
export const useAuthStore = create<AuthState>((set, get) => ({
  ...initialState,
  
  // State setters
  setUser: (user) => set({ user }),
  setIsAuthenticated: (value) => set({ isAuthenticated: value }),
  setIsLoading: (value) => set({ isLoading: value }),
  setError: (error) => set({ error }),
  
  // Auth actions
  login: async (username, password, deviceInfo) => {
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
      
      // Clear user data from query cache
      // This would normally use the queryClient, but we'll need to handle this differently
      // since we're in a store and not a React component with the queryClient hook
    }
  },
  
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
        user: userProfile as UserProfile, 
        isAuthenticated: true 
      });
      
      return userProfile as UserProfile;
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
  },
  
  // RBAC helpers
  hasRole: (role) => {
    const { user } = get();
    if (!user || !user.roles) return false;
    
    return user.roles.some(r => r === role);
  },
  
  hasPermission: (permission) => {
    const { user } = get();
    if (!user || !user.permissions) return false;
    
    return user.permissions.some(p => p === permission);
  },
  
  hasAccess: (roles, permissions) => {
    // If both roles and permissions are empty, no access required
    if (roles.length === 0 && permissions.length === 0) return true;
    
    // Check roles first if specified
    if (roles.length > 0) {
      const hasRequiredRole = roles.some(role => get().hasRole(role));
      if (hasRequiredRole) return true;
    }
    
    // Then check permissions if specified
    if (permissions.length > 0) {
      const hasRequiredPermission = permissions.some(permission => 
        get().hasPermission(permission)
      );
      if (hasRequiredPermission) return true;
    }
    
    // No matching roles or permissions
    return false;
  }
}));

// Selector hooks for accessing auth state
export const useUser = () => useAuthStore(state => state.user);
export const useIsAuthenticated = () => useAuthStore(state => state.isAuthenticated);
export const useAuthLoading = () => useAuthStore(state => state.isLoading);
export const useAuthError = () => useAuthStore(state => state.error);

// Selector for RBAC helpers
export const useRbacHelpers = () => useAuthStore(state => ({
  hasRole: state.hasRole,
  hasPermission: state.hasPermission,
  hasAccess: state.hasAccess
}));

// Selector for auth actions
export const useAuthActions = () => useAuthStore(state => ({
  login: state.login,
  logout: state.logout,
  refreshUserProfile: state.refreshUserProfile
}));

/**
 * Hook to initialize the auth store
 * 
 * This hook should be called at the root level of the application
 * to ensure the auth state is initialized properly.
 */
export const useInitAuth = () => {
  const refreshUserProfile = useAuthStore(state => state.refreshUserProfile);
  const queryClient = useQueryClient();
  
  // Register a listener for logout to clear query cache
  useAuthStore.subscribe(
    (state) => state.isAuthenticated,
    (isAuthenticated, previousIsAuthenticated) => {
      // If the user just logged out
      if (previousIsAuthenticated && !isAuthenticated) {
        // Clear user data from query cache
        queryClient.removeQueries({ 
          queryKey: authService.queryKeys.all()
        });
      }
    }
  );
  
  return { refreshUserProfile };
};