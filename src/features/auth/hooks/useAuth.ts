import { useCallback } from 'react';
import { apiClient } from '@/features/tanstack-query-api';
import { AUTH_ENDPOINTS } from '../api/constants';
import type { RegistrationData } from '../types';
import type { RegisterRequest } from '../api/types';
import { useAuthContext } from '../core/AuthContext';

/**
 * Main auth hook that combines context and mutations functionality
 */
export const useAuth = () => {
  const authContext = useAuthContext();

  const register = useCallback(async (data: any) => {
    try {
      // Convert from old format to new format if needed
      const registerRequest: RegisterRequest = data.emailAddress 
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
      
      // Use apiClient directly instead of mutation hooks
      const response = await apiClient.post(AUTH_ENDPOINTS.register, registerRequest);
      return response.data;
    } catch (error) {
      throw error;
    }
  }, []);

  const requestPasswordReset = useCallback(async (email: string) => {
    try {
      // Use apiClient directly instead of mutation hooks
      const response = await apiClient.post(AUTH_ENDPOINTS.requestPasswordReset, { email });
      return response.data;
    } catch (error) {
      throw error;
    }
  }, []);

  const resetPassword = useCallback(async (token: string, newPassword: string) => {
    try {
      // Use apiClient directly instead of mutation hooks
      await apiClient.post(AUTH_ENDPOINTS.resetPassword, { 
        token, 
        newPassword,
        confirmPassword: newPassword 
      });
    } catch (error) {
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

    // Loading/error states are managed in the component using the hook
    isRegistering: false,
    isRequestingReset: false,
    isResettingPassword: false,
    registerError: null,
    resetRequestError: null,
    resetPasswordError: null
  };
};
