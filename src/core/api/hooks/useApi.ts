/**
 * API Hooks Re-export
 * 
 * This module re-exports all API hooks from their specialized modules,
 * providing backward compatibility while maintaining a clean architecture.
 * 
 * @deprecated Import hooks directly from their specialized modules instead.
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
