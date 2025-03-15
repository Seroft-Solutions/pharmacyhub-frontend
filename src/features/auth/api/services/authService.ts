/**
 * Auth API Service
 * 
 * This service provides hooks for authentication-related API operations
 * using the tanstack-query-api framework.
 */
import { useQueryClient } from '@tanstack/react-query';
import { 
  createApiHooks, 
  useApiQuery, 
  useApiMutation 
} from '@/features/tanstack-query-api';

import { AUTH_ENDPOINTS, USER_ENDPOINTS_MAP } from '../constants';
import { tokenManager } from '../../core/tokenManager';

import type { 
  UserProfile,
  UserPreferences,
  LoginRequest, 
  RegisterRequest,
  AuthResponse,
  PasswordResetRequest,
  PasswordResetCompletion,
  PasswordChangeRequest
} from '../../types';

/**
 * Create standard CRUD hooks for user management
 */
export const userApiHooks = createApiHooks<UserProfile>(
  USER_ENDPOINTS_MAP,
  {
    resourceName: 'users',
    requiresAuth: true,
    defaultStaleTime: 5 * 60 * 1000 // 5 minutes
  }
);

/**
 * Hook for user login
 * Handles authentication and token storage
 */
export const useLogin = () => {
  const queryClient = useQueryClient();
  
  return useApiMutation<AuthResponse, LoginRequest>(
    AUTH_ENDPOINTS.LOGIN,
    {
      requiresAuth: false,
      onSuccess: (data) => {
        if (data?.tokens) {
          // Store tokens using tokenManager
          tokenManager.initializeFromAuthResponse(data);
          
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
 * Handles account creation and automatic login
 */
export const useRegister = () => {
  const queryClient = useQueryClient();
  
  return useApiMutation<AuthResponse, RegisterRequest>(
    AUTH_ENDPOINTS.REGISTER,
    {
      requiresAuth: false,
      onSuccess: (data) => {
        if (data?.tokens) {
          // Store tokens using tokenManager
          tokenManager.initializeFromAuthResponse(data);
          
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
 * Clears authentication state and redirects
 */
export const useLogout = () => {
  const queryClient = useQueryClient();
  
  return useApiMutation<void, void>(
    AUTH_ENDPOINTS.LOGOUT,
    {
      onSettled: () => {
        // Always clear auth state, even on error
        tokenManager.clearAll();
        
        // Clear user-related cache
        queryClient.removeQueries({
          queryKey: userApiHooks.queryKeys.all()
        });
      }
    }
  );
};

/**
 * Hook for refreshing auth token
 */
export const useRefreshToken = () => {
  return useApiMutation<AuthResponse, { refreshToken: string }>(
    AUTH_ENDPOINTS.REFRESH_TOKEN,
    {
      requiresAuth: false,
      onSuccess: (data) => {
        if (data?.tokens) {
          tokenManager.initializeFromAuthResponse(data);
        }
      }
    }
  );
};

/**
 * Hook for getting the current user profile
 */
export const useUserProfile = (options = {}) => {
  const isAuthenticated = tokenManager.hasToken();
  
  return useApiQuery<UserProfile>(
    userApiHooks.queryKeys.detail('me'),
    AUTH_ENDPOINTS.PROFILE,
    {
      enabled: isAuthenticated,
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: isAuthenticated ? 3 : 0,
      ...options
    }
  );
};

/**
 * Hook for updating user profile
 */
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  
  return useApiMutation<UserProfile, Partial<UserProfile>>(
    AUTH_ENDPOINTS.UPDATE_PROFILE,
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
    AUTH_ENDPOINTS.REQUEST_PASSWORD_RESET,
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
    `${AUTH_ENDPOINTS.VALIDATE_RESET_TOKEN}/${token}`,
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
    AUTH_ENDPOINTS.RESET_PASSWORD,
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
    AUTH_ENDPOINTS.CHANGE_PASSWORD,
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
    AUTH_ENDPOINTS.UPDATE_PREFERENCES,
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
    `${AUTH_ENDPOINTS.VERIFY_EMAIL_STATUS}/${encodeURIComponent(email)}`,
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
    AUTH_ENDPOINTS.VERIFY_EMAIL,
    {
      requiresAuth: false
    }
  );
};

/**
 * Export all hooks as a unified service
 */
export const authService = {
  // User CRUD hooks
  ...userApiHooks,
  
  // Authentication hooks
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
  
  // Query keys for custom queries
  queryKeys: userApiHooks.queryKeys
};

export default authService;
