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
  useApiMutation,
  unwrapAuthResponse,
  extractUserProfile
} from '../../../app-api-handler';
// Import our safe toast wrapper
import { safeToast as toast } from '@/components/ui/toast-utils';

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
  
  return useApiMutation<AuthResponse, LoginRequest & Record<string, string>>(
    AUTH_ENDPOINTS.LOGIN,
    {
      requiresAuth: false,
      // Log the request payload for debugging
      onMutate: (variables) => {
        console.debug('[Auth] Login mutation variables:', { 
          ...variables,
          password: '[REDACTED]', // Don't log actual password
          endpoint: AUTH_ENDPOINTS.LOGIN
        });
        return variables;
      },
      onSuccess: (response) => {
        console.debug('[Auth] Login success:', { 
          hasData: !!response?.data,
          hasTokens: !!response?.data?.tokens,
          hasUser: !!response?.data?.user,
          success: response?.success,
          status: response?.status
        });
        
        // Unwrap the response to standardize format
        const unwrappedResponse = unwrapAuthResponse(response);
        
        if (unwrappedResponse?.tokens) {
          // Store tokens using tokenManager
          tokenManager.initializeFromAuthResponse(unwrappedResponse);
          
          // Pre-populate the user profile in the cache
          if (unwrappedResponse.user) {
            queryClient.setQueryData(
              userApiHooks.queryKeys.detail('me'),
              unwrappedResponse.user
            );
          }
        }
      },
      onError: (error) => {
        console.error('[Auth] Login error:', error);
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
      // Handle wrapped response format using our utility
      select: (response) => {
        console.debug('[Auth] Processing user profile response', {
          hasData: !!response?.data,
          responseType: typeof response,
        });
        
        return extractUserProfile<UserProfile>(response);
      },
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
  return useApiMutation<void, { requestData: any }>(
    AUTH_ENDPOINTS.REQUEST_PASSWORD_RESET, 
    {
      requiresAuth: false,
      timeout: 10000, // 10 second timeout
      // Transform the payload to match backend expectations
      onMutate: (requestData) => {
        console.debug('[Auth] Password reset request sent:', { email: requestData.emailAddress });
        return { emailAddress: requestData.emailAddress };
      },
      // Show a toast message even if we haven't received a response yet
      onSuccess: () => {
        toast.success("Reset link sent. Please check your email.");
      },
      onError: (error) => {
        // Check if this is a timeout error
        if (error.message?.includes('timeout') || error.status === 408) {
          // Handle timeout - still show success since the request might be processing
          toast.info("Request was sent, but took longer than expected. Please check your email in a few minutes.");
        } else {
          // Other errors
          toast.error("Something went wrong sending the reset link. Please try again.");
          console.error('[Auth] Reset request error:', error);
        }
      }
    }
  );
};

/**
 * Hook for validating a password reset token
 */
export const useValidateResetToken = () => {
  return useApiMutation<{ valid: boolean }, string>(
    (token) => `${AUTH_ENDPOINTS.VALIDATE_RESET_TOKEN}/${encodeURIComponent(token)}`,
    {
      requiresAuth: false,
      timeout: 8000, // 8 second timeout
      method: 'GET',
      onError: (error) => {
        console.error('[Auth] Token validation error:', error);
      }
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
      requiresAuth: false,
      timeout: 10000, // 10 second timeout
      onSuccess: () => {
        toast.success("Password has been successfully reset");
      },
      onError: (error) => {
        console.error('[Auth] Password reset error:', error);
        if (error.message?.includes('timeout') || error.status === 408) {
          toast.info("Your request is being processed. Please try logging in with your new password.");
        } else {
          toast.error("Failed to reset password. Please try again.");
        }
      }
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
 * Hook for verifying OTP
 */
export const useVerifyOtp = () => {
  return useApiMutation<{ sessionId: string }, { otp: string; deviceId: string; userAgent: string }>(
    AUTH_ENDPOINTS.VERIFY_OTP,
    {
      requiresAuth: true,
    }
  );
};

/**
 * Hook for resending verification email
 */
export const useResendVerification = () => {
  return useApiMutation<void, { emailAddress: string, deviceId?: string, userAgent?: string, ipAddress?: string }>(
    AUTH_ENDPOINTS.RESEND_VERIFICATION,
    {
      requiresAuth: false,
      onSuccess: () => {
        console.debug('[Auth] Verification email resent successfully');
      },
      onError: (error) => {
        console.error('[Auth] Failed to resend verification email:', error);
      }
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
  useVerifyOtp,
  useResendVerification,
  
  // Query keys for custom queries
  queryKeys: userApiHooks.queryKeys
};

export default authService;
