/**
 * TanStack Query API Integration
 * 
 * This module provides a complete solution for API communication in React applications
 * using TanStack Query (formerly React Query). It includes a custom API client,
 * query hooks, service factories, and standardized types.
 * 
 * Main features:
 * - API client with authentication, error handling, and request deduplication
 * - TanStack Query hooks for data fetching and mutations
 * - Service factories for creating type-safe API services
 * - Standardized response structures and error handling
 * - TypeScript support throughout
 */

// Export components
export { default as QueryProvider } from './components/QueryProvider';

// Export core functionality
export { 
  apiClient, 
  createApiClient 
} from './core/apiClient';

export {
  queryClient,
  createQueryClient,
  defaultQueryErrorHandler
} from './core/queryClient';

// Export hook utilities
export {
  useApiQuery,
  useApiMutation,
  useApiPut,
  useApiPatch,
  useApiDelete,
  useApiPaginatedQuery,
  useApiInfiniteQuery,
  createQueryKeys
} from './hooks/useApi';

// Export service factories
export {
  createApiService,
  createExtendedApiService
} from './services/createService';

// Export hook factories
export {
  createApiHooks,
  createResourceQueryKeys
} from './factories/createApiHooks';

// Export types
export {
  apiQueryKeys,
  buildQueryString
} from './utils/types';

// Export all types
export type {
  // From apiClient.ts
  ApiClientConfig,
  RequestOptions,
  ApiResponse,
  ApiError,
  RetryConfig,
} from './core/apiClient';

export type {
  // From useApi.ts
  UseApiQueryOptions,
  UseApiMutationOptions,
  PaginationParams as ApiPaginationParams,
} from './hooks/useApi';

export type {
  // From createService.ts
  ApiService,
} from './services/createService';

export type {
  // From types.ts
  ApiPaginatedResponse,
  ApiSuccessResponse,
  ApiFailureResponse,
  ApiWrappedResponse,
  ApiErrorResponse,
  FilterParams,
  QueryParams,
  PaginationParams,
} from './utils/types';
