/**
 * API Hooks Re-export
 * 
 * This module re-exports all API hooks from their specialized modules,
 * providing backward compatibility while maintaining a clean architecture.
 * 
 * @deprecated Import hooks directly from their specialized modules instead.
 * 
 * @example
 * // Instead of:
 * import { useApiQuery } from '@/core/api/hooks/useApi';
 * 
 * // Prefer:
 * import { useApiQuery } from '@/core/api/hooks/query/useApiQuery';
 * 
 * // Or use the index exports:
 * import { useApiQuery } from '@/core/api/hooks';
 */

// Export query hooks
export { 
  useApiQuery,
  useApiPaginatedQuery,
  useApiInfiniteQuery
} from './query/useApiQuery';

// Export mutation hooks
export {
  useApiMutation,
  useApiPut,
  useApiPatch
} from './mutation/useApiMutation';

// Export delete hook
export { useApiDelete } from './mutation/useApiDelete';

// Export query key utilities
export { createQueryKeys, apiQueryKeys } from './query/useQueryKeys';

/**
 * @deprecated Use the specialized hooks directly
 */
export const useApi = {
  query: useApiQuery,
  mutation: useApiMutation,
  delete: useApiDelete,
  put: useApiPut,
  patch: useApiPatch,
  paginatedQuery: useApiPaginatedQuery,
  infiniteQuery: useApiInfiniteQuery
};

export default useApi;
