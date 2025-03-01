import { useApiQuery } from '@/features/tanstack-query-api';
import { authKeys } from '../queryKeys';
import { AUTH_ROUTES } from '../../constants/routes';
import type { User } from '../services/userService';
import { tokenManager } from '../../core/tokenManager';

/**
 * Hook for fetching the current user's profile
 * Only enabled when user is authenticated
 */
export const useUserProfile = () => {
  // Check if user is authenticated to prevent unnecessary API calls
  const isAuthenticated = tokenManager.hasToken();
  
  return useApiQuery<User>(
    authKeys.me(),
    AUTH_ROUTES.PROFILE,
    {
      // Only enable the query if the user is authenticated
      enabled: isAuthenticated,
      staleTime: 5 * 60 * 1000, // Consider profile data fresh for 5 minutes
      gcTime: 30 * 60 * 1000, // Keep in cache for 30 minutes
      // Don't retry on public pages if auth fails
      retry: isAuthenticated ? 3 : 0,
      // Suppress error notifications on login/public pages
      useErrorBoundary: isAuthenticated,
    }
  );
};

/**
 * Hook for validating password reset token
 */
export const useResetTokenValidation = (token: string) => {
  return useApiQuery<{ valid: boolean }>(
    authKeys.resetToken(token),
    `${AUTH_ROUTES.RESET_PASSWORD}/validate/${token}`,
    {
      enabled: !!token,
      // Don't cache or retry invalid tokens
      gcTime: 0,
      retry: false
    }
  );
};
