/**
 * useQueryKeys Hook
 * 
 * This hook provides access to query keys in components.
 * It helps to maintain consistent query keys across the application.
 */
import { QueryKey } from '@tanstack/react-query';
import { createQueryKeyFactory } from '../../utils/queryKeyFactory';

/**
 * Hook to create query keys for a specific entity
 * 
 * @param domain The domain or entity name
 * @returns Query key factory for the domain
 */
export function useQueryKeys<T extends string>(domain: string) {
  return createQueryKeyFactory<T>(domain);
}

/**
 * Helper function to create parameterized query keys
 * 
 * @param baseKey The base query key
 * @param params The parameters to add to the query key
 * @returns A query key with parameters
 */
export function createParameterizedQueryKey(
  baseKey: QueryKey,
  params?: Record<string, any>
): QueryKey {
  if (!params || Object.keys(params).length === 0) {
    return baseKey;
  }
  
  return [...baseKey, params];
}

/**
 * Example usage:
 * 
 * ```typescript
 * // Using the hook in a component
 * const userKeys = useQueryKeys<'me' | 'profile'>('users');
 * 
 * // Using the helper function
 * const filteredUsersKey = createParameterizedQueryKey(
 *   userKeys.lists(),
 *   { role: 'admin', status: 'active' }
 * );
 * ```
 */