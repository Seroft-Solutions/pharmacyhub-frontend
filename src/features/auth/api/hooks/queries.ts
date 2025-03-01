import { useApiQuery } from '@/features/tanstack-query-api';
import { authKeys } from '../queryKeys';
import type { UserProfile } from '../../types';

/**
 * Hook for fetching the current user's profile
 */
export const useUserProfile = () => {
  return useApiQuery<UserProfile>(
    authKeys.me(),
    '/auth/profile',
    {
      staleTime: 5 * 60 * 1000, // Consider profile data fresh for 5 minutes
      gcTime: 30 * 60 * 1000, // Keep in cache for 30 minutes
    }
  );
};

/**
 * Hook for validating password reset token
 */
export const useResetTokenValidation = (token: string) => {
  return useApiQuery<{ valid: boolean }>(
    authKeys.resetToken(token),
    `/auth/reset-password/validate/${token}`,
    {
      enabled: !!token,
      // Don't cache or retry invalid tokens
      gcTime: 0,
      retry: false
    }
  );
};
