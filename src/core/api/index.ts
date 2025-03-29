/**
 * Core API Module
 * 
 * This module manages all API-related functionality for the application.
 * It provides tools for making API requests, handling responses, and
 * integrating with TanStack Query for state management.
 * 
 * Key features:
 * - API client configuration and customization
 * - Data fetching hooks with TanStack Query integration
 * - Request/response handling with proper error management
 * - Standardized API response types and interfaces
 * - Debugging utilities for API connectivity
 * - Query key factories for consistent query keys
 * - Optimistic update utilities for better UX
 * 
 * Usage examples:
 * ```ts
 * // Using the API client directly
 * import { apiClient } from '@/core/api';
 * const response = await apiClient.get<UserData>('/users/me');
 * 
 * // Using hooks for data fetching
 * import { useApiQuery } from '@/core/api/hooks';
 * import { userKeys } from '@/core/api/utils/queryKeyFactory';
 * const { data, isLoading } = useApiQuery(userKeys.detail('123'), '/users/123');
 * 
 * // Using hooks for mutations
 * import { useApiMutation } from '@/core/api/hooks';
 * const { mutate } = useApiMutation<UserData>('/users');
 * 
 * // Using optimistic updates
 * import { optimisticAddItem } from '@/core/api/utils/optimisticUpdates';
 * const previousData = optimisticAddItem({
 *   queryClient,
 *   queryKey: userKeys.lists(),
 *   newItem: newUser
 * });
 * ```
 */

// Export core functionality
export { 
  apiClient, 
  createApiClient,
  queryClient,
  createQueryClient,
  defaultQueryErrorHandler
} from './core';

// Export providers
export { QueryClientProvider } from './providers/QueryClientProvider';

// Export components
export * from './components';

// Export examples
export * as examples from './examples';

// Export hooks
export * from './hooks';

// Export services
export * from './services';

// Export types
export * from './types';

// Export utilities
export * from './utils';

// Export query key factories
export { 
  createQueryKeyFactory,
  apiKeys,
  userKeys,
  authKeys
} from './utils/queryKeyFactory';

// Export optimistic update utilities
export {
  optimisticAddItem,
  optimisticUpdateItem,
  optimisticRemoveItem,
  optimisticAddItemToInfiniteQuery,
  optimisticUpdateItemInInfiniteQuery,
  optimisticRemoveItemFromInfiniteQuery
} from './utils/optimisticUpdates';