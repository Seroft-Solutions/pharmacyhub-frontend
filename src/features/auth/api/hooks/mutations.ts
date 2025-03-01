import { useApiMutation } from '@/features/tanstack-query-api';
import { tokenManager } from '../../core';
import type { LoginResponse, RegistrationData } from '../../types';

/**
 * Hook for handling login mutations
 */
export const useLoginMutation = () => {
  return useApiMutation<LoginResponse, { email: string; password: string }>(
    '/auth/login',
    {
      onSuccess: (data) => {
        // Save tokens on successful login
        if (data.token) {
          tokenManager.setToken(data.token);
          if (data.refreshToken) {
            tokenManager.setRefreshToken(data.refreshToken);
          }
          if (data.expiresIn) {
            const expiryTime = Date.now() + (data.expiresIn * 1000);
            tokenManager.setTokenExpiry(expiryTime);
          }
        }
      }
    }
  );
};

/**
 * Hook for handling registration mutations
 */
export const useRegisterMutation = () => {
  return useApiMutation<void, RegistrationData>(
    '/auth/register'
  );
};

/**
 * Hook for handling password reset request
 */
export const usePasswordResetRequestMutation = () => {
  return useApiMutation<{ success: boolean }, { email: string }>(
    '/auth/forgot-password'
  );
};

/**
 * Hook for handling password reset completion
 */
export const usePasswordResetCompleteMutation = () => {
  return useApiMutation<void, { token: string; newPassword: string }>(
    '/auth/reset-password'
  );
};

/**
 * Hook for handling logout
 */
export const useLogoutMutation = () => {
  return useApiMutation<void, void>(
    '/auth/logout',
    {
      onSuccess: () => {
        tokenManager.removeToken();
        window.location.href = '/login';
      }
    }
  );
};

/**
 * Hook for refreshing auth token
 */
export const useRefreshTokenMutation = () => {
  return useApiMutation<{ token: string; refreshToken?: string; expiresIn?: number }, { refreshToken: string }>(
    '/auth/token/refresh',
    {
      onSuccess: (data) => {
        if (data.token) {
          tokenManager.setToken(data.token);
          if (data.refreshToken) {
            tokenManager.setRefreshToken(data.refreshToken);
          }
          if (data.expiresIn) {
            const expiryTime = Date.now() + (data.expiresIn * 1000);
            tokenManager.setTokenExpiry(expiryTime);
          }
        }
      }
    }
  );
};
