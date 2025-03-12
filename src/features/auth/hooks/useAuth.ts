import { useCallback } from 'react';
import { 
  useRegisterMutation,
  usePasswordResetRequestMutation,
  usePasswordResetCompleteMutation
} from '../api/hooks/mutations';
import type { RegistrationData } from '../types';
import type { RegisterRequest } from '../api/services/authService';
import { useAuthContext } from '../core/AuthContext';

/**
 * Main auth hook that combines context and mutations functionality
 */
export const useAuth = () => {
  const authContext = useAuthContext();
  const registerMutation = useRegisterMutation();
  const resetRequestMutation = usePasswordResetRequestMutation();
  const resetCompleteMutation = usePasswordResetCompleteMutation();

  const register = useCallback(async (data: any) => {
    try {
      // If data is already in the correct format, use it directly
      if (data.emailAddress) {
        await registerMutation.mutateAsync(data);
      } else {
        // Convert from old format to new format if needed
        const registerRequest: RegisterRequest = {
          emailAddress: data.email,
          password: data.password,
          firstName: data.firstName || '',
          lastName: data.lastName || '',
          contactNumber: data.phoneNumber,
          userType: data.userType,
          openToConnect: false
        };
        await registerMutation.mutateAsync(registerRequest);
      }
    } catch (error) {
      throw error;
    }
  }, [registerMutation]);

  const requestPasswordReset = useCallback(async (email: string) => {
    try {
      const response = await resetRequestMutation.mutateAsync({ email });
      return response;
    } catch (error) {
      throw error;
    }
  }, [resetRequestMutation]);

  const resetPassword = useCallback(async (token: string, newPassword: string) => {
    try {
      await resetCompleteMutation.mutateAsync({ 
        token, 
        newPassword,
        confirmPassword: newPassword 
      });
    } catch (error) {
      throw error;
    }
  }, [resetCompleteMutation]);

  return {
    // Context state and methods
    ...authContext,

    // Additional mutation actions
    register,
    requestPasswordReset,
    resetPassword,

    // Additional loading states
    isRegistering: registerMutation.isPending,
    isRequestingReset: resetRequestMutation.isPending,
    isResettingPassword: resetCompleteMutation.isPending,

    // Additional error states
    registerError: registerMutation.error,
    resetRequestError: resetRequestMutation.error,
    resetPasswordError: resetCompleteMutation.error
  };
};
