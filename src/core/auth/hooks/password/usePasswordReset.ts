/**
 * Password Reset Hook
 * 
 * Provides password reset request and completion functionality
 * with error handling and loading state.
 */
import { useCallback } from 'react';
import { logger } from '@/shared/lib/logger';

// Import auth service placeholders
// These will be replaced when we move the API services
const authService = {
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

/**
 * Hook for handling password reset functionality
 * 
 * @returns Password reset functions and loading/error states
 */
export const usePasswordReset = () => {
  // Get API hooks from authService
  const resetRequestMutation = authService.useRequestPasswordReset();
  const resetPasswordMutation = authService.useCompletePasswordReset();

  /**
   * Request a password reset by sending a reset link to user's email
   * 
   * @param email - User's email address
   * @returns Response from password reset request API
   */
  const requestPasswordReset = useCallback(async (email: string) => {
    try {
      logger.debug('[Auth] Password reset request', { email });
      return await resetRequestMutation.mutateAsync({ email });
    } catch (error) {
      logger.error('[Auth] Password reset request error', { error, email });
      throw error;
    }
  }, [resetRequestMutation]);

  /**
   * Complete the password reset process with the token and new password
   * 
   * @param token - Password reset token from email link
   * @param newPassword - New password to set
   */
  const resetPassword = useCallback(async (token: string, newPassword: string) => {
    try {
      logger.debug('[Auth] Password reset completion attempt');
      
      await resetPasswordMutation.mutateAsync({ 
        token, 
        newPassword,
        confirmPassword: newPassword 
      });
      
      logger.debug('[Auth] Password reset successful');
    } catch (error) {
      logger.error('[Auth] Password reset error', { error });
      throw error;
    }
  }, [resetPasswordMutation]);

  return {
    requestPasswordReset,
    resetPassword,
    isRequestingReset: resetRequestMutation.isPending,
    isResettingPassword: resetPasswordMutation.isPending,
    resetRequestError: resetRequestMutation.error,
    resetPasswordError: resetPasswordMutation.error
  };
};

export default usePasswordReset;
