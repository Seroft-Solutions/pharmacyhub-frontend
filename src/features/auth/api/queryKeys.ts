import { createQueryKeys } from '@/features/tanstack-query-api/hooks/useApi';
import { QueryKey } from '@tanstack/react-query';

/**
 * Type definitions for auth query keys
 */
type AuthQueryKeys = {
  all: () => QueryKey;
  me: () => QueryKey;
  validation: () => QueryKey;
  resetToken: (token: string) => QueryKey;
  verificationStatus: (email: string) => QueryKey;
};

/**
 * Type-safe query keys for auth feature
 */
export const authKeys: AuthQueryKeys = createQueryKeys({
  all: () => ['auth'] as const,
  me: () => [...authKeys.all(), 'me'] as const,
  validation: () => [...authKeys.all(), 'validation'] as const,
  resetToken: (token: string) => [...authKeys.validation(), 'reset', token] as const,
  verificationStatus: (email: string) => [...authKeys.validation(), 'verification', email] as const,
});

export default authKeys;
