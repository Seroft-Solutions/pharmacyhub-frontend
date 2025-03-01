import { useCallback } from 'react';
import { 
  useLoginMutation, 
  useLogoutMutation, 
  useRegisterMutation,
  usePasswordResetRequestMutation,
  usePasswordResetCompleteMutation
} from '../api/hooks/mutations';
import { useUserProfile } from '../api/hooks/queries';
import { tokenManager } from '../core';
import type { RegistrationData } from '../types';

/**
 * Main auth hook that combines all auth-related functionality
 */
export const useAuth = () => {
  const loginMutation = useLoginMutation();
  const logoutMutation = useLogoutMutation();
  const registerMutation = useRegisterMutation();
  const resetRequestMutation = usePasswordResetRequestMutation();
  const resetCompleteMutation = usePasswordResetCompleteMutation();
  const { data: profile, isLoading: isLoadingProfile } = useUserProfile();

  const login = useCallback(async (email: string, password: string) => {
    try {
      const response = await loginMutation.mutateAsync({ email, password });
      return response;
    } catch (error) {
      throw error;
    }
  }, [loginMutation]);

  const register = useCallback(async (data: RegistrationData) => {
    try {
      await registerMutation.mutateAsync(data);
    } catch (error) {
      throw error;
    }
  }, [registerMutation]);

  const logout = useCallback(async () => {
    try {
      await logoutMutation.mutateAsync();
    } catch (error) {
      console.error('Logout error:', error);
      // Still clear tokens even if server call fails
      tokenManager.removeToken();
      window.location.href = '/login';
    }
  }, [logoutMutation]);

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
      await resetCompleteMutation.mutateAsync({ token, newPassword });
    } catch (error) {
      throw error;
    }
  }, [resetCompleteMutation]);

  const isAuthenticated = useCallback(() => {
    return tokenManager.hasToken();
  }, []);

  return {
    // User state
    user: profile,
    isLoadingUser: isLoadingProfile,
    isAuthenticated,

    // Auth actions
    login,
    register,
    logout,
    requestPasswordReset,
    resetPassword,

    // Loading states
    isLoggingIn: loginMutation.isPending,
    isRegistering: registerMutation.isPending,
    isLoggingOut: logoutMutation.isPending,
    isRequestingReset: resetRequestMutation.isPending,
    isResettingPassword: resetCompleteMutation.isPending,

    // Error states
    loginError: loginMutation.error,
    registerError: registerMutation.error,
    logoutError: logoutMutation.error,
    resetRequestError: resetRequestMutation.error,
    resetPasswordError: resetCompleteMutation.error
  };
};
