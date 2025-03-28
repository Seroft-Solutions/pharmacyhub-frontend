/**
 * Main auth hook that provides the AuthContext state and 
 * additional auth-related functionality.
 */
import { useCallback } from 'react';
import { useAuthContext } from '../core/AuthContext';
import { tokenManager } from '../core/tokenManager';
import type { RegistrationData, UserProfile } from '../types';

// Import auth service placeholders
// These will be replaced when we move the API services
const authService = {
  useRegister: () => ({
    mutateAsync: async () => ({}),
    isPending: false,
    error: null
  }),
  useRequestPasswordReset: () => ({
    mutateAsync: async () => ({}),
    isPending: false,
    error: null
  }),
  useCompletePasswordReset: () => ({
    mutateAsync: async () => ({}),
    isPending: false,
    error: null
  })
};

const authApiService = {
  processSocialLogin: async () => ({})
};

/**
 * Main auth hook that combines context state and auth operations
 * This is the primary hook for auth functionality
 */
export const useAuth = () => {
  const authContext = useAuthContext();
  
  // Get API hooks from authService
  const registerMutation = authService.useRegister();
  const resetRequestMutation = authService.useRequestPasswordReset();
  const resetPasswordMutation = authService.useCompletePasswordReset();

  // Registration function with adapter for different request formats
  const register = useCallback(async (data: RegistrationData) => {
    try {
      // Convert from old format to new format if needed
      const registerRequest = data.emailAddress 
        ? data // If data is already in the correct format, use it directly
        : {
          emailAddress: data.email,
          password: data.password,
          firstName: data.firstName || '',
          lastName: data.lastName || '',
          contactNumber: data.phoneNumber,
          userType: data.userType,
          openToConnect: false
        };
      
      return await registerMutation.mutateAsync(registerRequest);
    } catch (error) {
      throw error;
    }
  }, [registerMutation]);

  // Password reset request function
  const requestPasswordReset = useCallback(async (email: string) => {
    try {
      return await resetRequestMutation.mutateAsync({ email });
    } catch (error) {
      throw error;
    }
  }, [resetRequestMutation]);

  // Password reset completion function
  const resetPassword = useCallback(async (token: string, newPassword: string) => {
    try {
      await resetPasswordMutation.mutateAsync({ 
        token, 
        newPassword,
        confirmPassword: newPassword 
      });
    } catch (error) {
      throw error;
    }
  }, [resetPasswordMutation]);

  // Social login callback function to process code from OAuth provider
  const processSocialLogin = useCallback(async (code: string, deviceInfo?: Record<string, string>): Promise<any> => {
    try {
      // Get device info if not provided
      const deviceData = deviceInfo || tokenManager.getAuthDataForLogin();
      
      // Exchange authorization code for tokens
      const response = await authApiService.processSocialLogin(code, deviceData);
      
      return response;
    } catch (error) {
      console.error('Social login processing error:', error);
      throw error;
    }
  }, []);

  return {
    // Context state and methods
    ...authContext,

    // Additional actions
    register,
    requestPasswordReset,
    resetPassword,
    processSocialLogin,

    // Loading and error states
    isRegistering: registerMutation.isPending,
    isRequestingReset: resetRequestMutation.isPending,
    isResettingPassword: resetPasswordMutation.isPending,
    registerError: registerMutation.error,
    resetRequestError: resetRequestMutation.error,
    resetPasswordError: resetPasswordMutation.error
  };
};

export default useAuth;
