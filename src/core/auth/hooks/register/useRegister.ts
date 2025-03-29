/**
 * Registration Hook
 * 
 * Provides user registration functionality with error handling and loading state.
 */
import { useCallback } from 'react';
import { logger } from '@/shared/lib/logger';
import type { RegistrationData } from '../../types';

// Import auth service placeholders
// These will be replaced when we move the API services
const authService = {
  useRegister: () => ({
    mutateAsync: async () => ({}),
    isPending: false,
    error: null
  }),
};

/**
 * Hook for handling user registration functionality
 * 
 * @returns Registration function and loading/error states
 */
export const useRegister = () => {
  // Get API hook from authService
  const registerMutation = authService.useRegister();

  /**
   * Registration function with adapter for different request formats
   * 
   * @param data - User registration data
   * @returns Response from registration API
   */
  const register = useCallback(async (data: RegistrationData) => {
    try {
      logger.debug('[Auth] Registration attempt', { 
        email: data.emailAddress || data.email,
        userType: data.userType
      });
      
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
      
      // Call the registration API
      const response = await registerMutation.mutateAsync(registerRequest);
      
      logger.debug('[Auth] Registration successful', {
        status: response.status || 'success'
      });
      
      return response;
    } catch (error) {
      logger.error('[Auth] Registration error', { error });
      throw error;
    }
  }, [registerMutation]);

  return {
    register,
    isRegistering: registerMutation.isPending,
    registerError: registerMutation.error
  };
};

export default useRegister;
