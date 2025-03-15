/**
 * Main auth hook that provides the AuthContext state and 
 * additional auth-related functionality.
 */
import { useCallback } from 'react';
import { useAuthContext } from '../core/AuthContext';
import { authService } from '../api/services/authService';
import type { RegistrationData } from '../types';

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

  return {
    // Context state and methods
    ...authContext,

    // Additional actions
    register,
    requestPasswordReset,
    resetPassword,

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
