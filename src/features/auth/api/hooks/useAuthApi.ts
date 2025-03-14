/**
 * Auth API Hooks
 * 
 * This module provides React hooks for interacting with authentication-related APIs.
 * It leverages the createApiHooks factory for consistent patterns.
 * 
 * IMPORTANT: These hooks must only be used within React functional components.
 */
import { useQueryClient } from '@tanstack/react-query';
import { 
  createApiHooks, 
  useApiQuery, 
  useApiMutation 
} from '@/features/tanstack-query-api';
import { AUTH_ENDPOINTS } from '../constants';
import type { 
  User, 
  UserProfile,
  UserPreferences,
  LoginRequest, 
  RegisterRequest,
  AuthResponse,
  AuthTokens,
  PasswordResetRequest,
  PasswordResetCompletion,
  PasswordChangeRequest
} from '../types';

// Token storage helpers (safe to use outside components)
export const tokenStorage = {
  storeTokens: (tokens: AuthTokens): void => {
    if (typeof window === 'undefined') return;
    
    localStorage.setItem('accessToken', tokens.accessToken);
    localStorage.setItem('refreshToken', tokens.refreshToken);
    
    // Store token expiry
    const expiryTime = Date.now() + (tokens.expiresIn * 1000);
    localStorage.setItem('tokenExpiry', expiryTime.toString());
  },

  clearTokens: (): void => {
    if (typeof window === 'undefined') return;
    
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('tokenExpiry');
  },

  isAuthenticated: (): boolean => {
    if (typeof window === 'undefined') return false;
    
    const token = localStorage.getItem('accessToken');
    if (!token) return false;
    
    // Check token expiration
    const expiryStr = localStorage.getItem('tokenExpiry');
    if (expiryStr) {
      const expiry = parseInt(expiryStr, 10);
      if (Date.now() >= expiry) {
        // Token has expired
        return false;
      }
    }
    
    return true;
  },

  getToken: (): string | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('accessToken');
  }
};

// Create standard CRUD hooks for users
export const userApiHooks = createApiHooks<User>(
  AUTH_ENDPOINTS,
  {
    resourceName: 'users',
    requiresAuth: true,
    defaultStaleTime: 5 * 60 * 1000 // 5 minutes
  }
);

/**
 * Hook for user login
 */
export const useLogin = () => {
  const queryClient = useQueryClient();
  
  return useApiMutation<AuthResponse, LoginRequest>(
    AUTH_ENDPOINTS.login,
    {
      requiresAuth: false,
      onSuccess: (data) => {
        if (data?.tokens) {
          tokenStorage.storeTokens(data.tokens);
          
          // Pre-populate the user profile in the cache
          if (data.user) {
            queryClient.setQueryData(
              userApiHooks.queryKeys.detail('me'),
              data.user
            );
          }
        }
      }
    }
  );
};

/**
 * Hook for user registration
 */
export const useRegister = () => {
  const queryClient = useQueryClient();
  
  return useApiMutation<AuthResponse, RegisterRequest>(
    AUTH_ENDPOINTS.register,
    {
      requiresAuth: false,
      onSuccess: (data) => {
        if (data?.tokens) {
          tokenStorage.storeTokens(data.tokens);
          
          // Pre-populate the user profile in the cache
          if (data.user) {
            queryClient.setQueryData(
              userApiHooks.queryKeys.detail('me'),
              data.user
            );
          }
        }
      }
    }
  );
};

/**
 * Hook for user logout
 */
export const useLogout = () => {
  const queryClient = useQueryClient();
  
  return useApiMutation<void, void>(
    AUTH_ENDPOINTS.logout,
    {
      onSuccess: () => {
        // Clear tokens
        tokenStorage.clearTokens();
        
        // Clear user-related cache
        queryClient.removeQueries({
          queryKey: userApiHooks.queryKeys.all()
        });
        
        // Redirect to login
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
      }
    }
  );
};

/**
 * Hook for refreshing auth token
 */
export const useRefreshToken = () => {
  return useApiMutation<AuthTokens, { refreshToken: string }>(
    AUTH_ENDPOINTS.refreshToken,
    {
      requiresAuth: false,
      onSuccess: (data) => {
        if (data) {
          tokenStorage.storeTokens(data);
        }
      }
    }
  );
};

/**
 * Hook for getting the current user profile
 */
export const useUserProfile = () => {
  const isAuthenticated = tokenStorage.isAuthenticated();
  
  return useApiQuery<UserProfile>(
    userApiHooks.queryKeys.detail('me'),
    AUTH_ENDPOINTS.profile,
    {
      enabled: isAuthenticated,
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: isAuthenticated ? 3 : 0,
    }
  );
};

/**
 * Hook for updating user profile
 */
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  
  return useApiMutation<UserProfile, Partial<UserProfile>>(
    AUTH_ENDPOINTS.updateProfile,
    {
      method: 'PATCH',
      onSuccess: (data) => {
        // Update cache
        queryClient.setQueryData(
          userApiHooks.queryKeys.detail('me'),
          data
        );
      }
    }
  );
};

/**
 * Hook for requesting a password reset
 */
export const useRequestPasswordReset = () => {
  return useApiMutation<void, PasswordResetRequest>(
    AUTH_ENDPOINTS.requestPasswordReset,
    {
      requiresAuth: false
    }
  );
};

/**
 * Hook for validating a password reset token
 */
export const useValidateResetToken = (token: string) => {
  return useApiQuery<{ valid: boolean }>(
    [...userApiHooks.queryKeys.all(), 'resetToken', token],
    `${AUTH_ENDPOINTS.validateResetToken}/${token}`,
    {
      requiresAuth: false,
      enabled: !!token,
      staleTime: 0, // Always revalidate
      retry: false
    }
  );
};

/**
 * Hook for completing a password reset
 */
export const useCompletePasswordReset = () => {
  return useApiMutation<void, PasswordResetCompletion>(
    AUTH_ENDPOINTS.resetPassword,
    {
      requiresAuth: false
    }
  );
};

/**
 * Hook for changing password
 */
export const useChangePassword = () => {
  return useApiMutation<void, PasswordChangeRequest>(
    AUTH_ENDPOINTS.changePassword,
    {
      method: 'POST'
    }
  );
};

/**
 * Hook for updating user preferences
 */
export const useUpdatePreferences = () => {
  const queryClient = useQueryClient();
  
  return useApiMutation<UserPreferences, Partial<UserPreferences>>(
    AUTH_ENDPOINTS.updatePreferences,
    {
      method: 'PATCH',
      onSuccess: () => {
        // Invalidate user profile cache
        queryClient.invalidateQueries(
          userApiHooks.queryKeys.detail('me')
        );
      }
    }
  );
};

/**
 * Checking if email is verified
 */
export const useEmailVerificationStatus = (email: string) => {
  return useApiQuery<{ verified: boolean }>(
    [...userApiHooks.queryKeys.all(), 'verification', email],
    `${AUTH_ENDPOINTS.verifyEmailStatus}/${encodeURIComponent(email)}`,
    {
      requiresAuth: false,
      enabled: !!email,
      staleTime: 0, // Always revalidate
      gcTime: 0, // Don't cache verification status
      retry: false
    }
  );
};

/**
 * Hook for verifying email with token
 */
export const useVerifyEmail = () => {
  return useApiMutation<void, { token: string }>(
    AUTH_ENDPOINTS.verifyEmail,
    {
      requiresAuth: false
    }
  );
};

// Expose all hooks as a single object
export const authApiHooks = {
  ...userApiHooks,
  useLogin,
  useRegister,
  useLogout,
  useRefreshToken,
  useUserProfile,
  useUpdateProfile,
  useRequestPasswordReset,
  useValidateResetToken,
  useCompletePasswordReset,
  useChangePassword,
  useUpdatePreferences,
  useEmailVerificationStatus,
  useVerifyEmail,
  
  // Expose token storage helpers
  tokenStorage
};
