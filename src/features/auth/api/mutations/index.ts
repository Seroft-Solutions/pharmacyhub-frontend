/**
 * Auth mutations for handling API requests
 */
import { useMutation } from '@tanstack/react-query';
import { authService } from '../services/authService';
import { queryClient } from '@/features/tanstack-query-api/core/queryClient';

/**
 * Hook for handling login requests
 */
export const useLoginMutation = () => {
  return useMutation({
    mutationFn: (credentials: { email: string; password: string }) => {
      return authService.login(credentials);
    },
    onSuccess: (data) => {
      // Store tokens
      if (data?.data?.tokens) {
        authService.storeTokens(data.data.tokens);
      }
      
      // Invalidate user data queries
      queryClient.invalidateQueries({ queryKey: ['user'] });
    }
  });
};

/**
 * Hook for handling registration requests
 */
export const useRegisterMutation = () => {
  return useMutation({
    mutationFn: (userData: any) => {
      return authService.register(userData);
    },
    onSuccess: (data) => {
      // Store tokens if auto-login
      if (data?.data?.tokens) {
        authService.storeTokens(data.data.tokens);
      }
      
      // Invalidate user data queries
      queryClient.invalidateQueries({ queryKey: ['user'] });
    }
  });
};

/**
 * Hook for handling logout requests
 */
export const useLogoutMutation = () => {
  return useMutation({
    mutationFn: () => {
      return authService.logout();
    },
    onSuccess: () => {
      // Remove tokens
      authService.clearTokens();
      
      // Reset query cache
      queryClient.clear();
    }
  });
};

/**
 * Hook for handling password reset requests
 */
export const usePasswordResetRequestMutation = () => {
  return useMutation({
    mutationFn: ({ email }: { email: string }) => {
      return authService.requestPasswordReset(email);
    }
  });
};

/**
 * Hook for handling password reset completion
 */
export const usePasswordResetCompleteMutation = () => {
  return useMutation({
    mutationFn: ({ token, newPassword }: { token: string; newPassword: string }) => {
      return authService.resetPassword(token, newPassword, newPassword);
    }
  });
};

/**
 * Hook for handling email verification
 */
export const useVerifyEmailMutation = () => {
  return useMutation({
    mutationFn: (token: string) => {
      return authService.verifyEmail(token);
    }
  });
};

/**
 * Export all mutations
 */
export default {
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation,
  usePasswordResetRequestMutation,
  usePasswordResetCompleteMutation,
  useVerifyEmailMutation
};
