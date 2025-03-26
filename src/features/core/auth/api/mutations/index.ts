/**
 * Auth mutations for handling API requests
 */
import { useMutation } from '@tanstack/react-query';
import { authService } from '../services/authService';
import { queryClient } from '@/features/core/tanstack-query-api/core/queryClient';

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
      const { useRequestPasswordReset } = authService;
      return useRequestPasswordReset().mutateAsync({ email });
    }
  });
};

/**
 * Hook for handling password reset token validation
 */
export const useValidateResetTokenMutation = () => {
  return useMutation({
    mutationFn: (token: string) => {
      return authService.validateResetToken(token);
    }
  });
};

/**
 * Hook for handling password reset completion
 */
export const usePasswordResetCompleteMutation = () => {
  return useMutation({
    mutationFn: ({ token, password, confirmPassword }: { token: string; password: string; confirmPassword: string }) => {
      const { useCompletePasswordReset } = authService;
      return useCompletePasswordReset().mutateAsync({
        token, 
        newPassword: password,
        confirmPassword: confirmPassword || password
      });
    }
  });
};

/**
 * Hook for handling email verification
 */
export const useVerifyEmailMutation = () => {
  return useMutation({
    mutationFn: (token: string) => {
      const { useVerifyEmail } = authService;
      return useVerifyEmail().mutateAsync({ token });
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
  useValidateResetTokenMutation,
  usePasswordResetCompleteMutation,
  useVerifyEmailMutation
};
