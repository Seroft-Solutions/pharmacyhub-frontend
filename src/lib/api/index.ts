/**
 * Centralized API module
 * 
 * This module exports all API-related functionality from a single location,
 * making imports cleaner throughout the application.
 */

// Export the API client and factory function
export { default as apiClient, createApiClient } from './apiClient';
export type { 
  ApiClientConfig, 
  RequestOptions,
  ApiResponse
} from './apiClient';

// Export query hooks
export {
  useApiQuery,
  useApiMutation,
  useApiPut,
  useApiPatch,
  useApiDelete,
  useApiPaginatedQuery,
  useApiInfiniteQuery,
  createQueryKeys
} from './hooks';
export type {
  UseApiQueryOptions,
  UseApiMutationOptions,
  PaginationParams
} from './hooks';

// Export common API types
export type {
  ApiPaginatedResponse,
  ApiSuccessResponse,
  ApiFailureResponse,
  ApiWrappedResponse,
  ApiErrorResponse,
  FilterParams,
  QueryParams
} from './types';

// Export all services
export * from './services';

/**
 * Define standard query keys for common entity types
 * 
 * Using this object helps maintain consistency in query keys
 * across the application and enables better cache management.
 */
export const apiQueryKeys = {
  auth: {
    user: () => ['auth', 'user'],
    session: () => ['auth', 'session'],
    login: () => ['auth', 'login'],
    register: () => ['auth', 'register'],
  },
  users: {
    all: () => ['users'],
    list: (filters?: any) => ['users', 'list', filters],
    detail: (id: string | number) => ['users', 'detail', id],
    profile: () => ['users', 'profile'],
    settings: () => ['users', 'settings'],
  },
  exams: {
    all: () => ['exams'],
    list: (filters?: any) => ['exams', 'list', filters],
    detail: (id: string | number) => ['exams', 'detail', id],
    questions: (examId: string | number) => ['exams', 'questions', examId],
    results: (examId: string | number, userId?: string) => 
      userId ? ['exams', examId, 'results', userId] : ['exams', examId, 'results'],
  },
  progress: {
    user: (userId?: string) => ['progress', 'user', userId],
    exam: (examId: string | number) => ['progress', 'exam', examId],
    detail: (userId: string, examId: string) => ['progress', 'detail', userId, examId],
    statistics: (userId?: string) => ['progress', 'statistics', userId],
  },
  licensing: {
    all: () => ['licensing'],
    list: (filters?: any) => ['licensing', 'list', filters],
    detail: (id: string | number) => ['licensing', 'detail', id],
    user: (userId?: string) => ['licensing', 'user', userId],
  },
};

/**
 * Utility to build URL query strings from objects
 * 
 * @param params Object containing query parameters
 * @returns URL-encoded query string (without the leading '?')
 */
export function buildQueryString(params: Record<string, any>): string {
  return Object.entries(params)
    .filter(([_, value]) => value !== undefined && value !== null && value !== '')
    .map(([key, value]) => {
      // Handle array values
      if (Array.isArray(value)) {
        return value
          .map(v => `${encodeURIComponent(key)}=${encodeURIComponent(v)}`)
          .join('&');
      }
      return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
    })
    .join('&');
}

/**
 * Hook factory for creating paginated query hooks for specific entities
 * 
 * @param baseEndpoint The base API endpoint for the entity
 * @param queryKeyFn Function to generate the query key
 * @returns A hook for paginated queries of this entity type
 */
export function createPaginatedQueryHook<T>(
  baseEndpoint: string,
  queryKeyFn: (filters?: any) => any[]
) {
  return function usePaginatedQuery(
    page = 0,
    size = 10,
    filters?: Record<string, any>,
    options?: UseApiQueryOptions<ApiPaginatedResponse<T>>
  ) {
    // Build query string
    const queryParams = { page, size, ...filters };
    const queryString = buildQueryString(queryParams);
    
    // Create endpoint with query string
    const endpoint = queryString 
      ? `${baseEndpoint}?${queryString}`
      : baseEndpoint;
    
    // Generate query key
    const queryKey = [...queryKeyFn(filters), { page, size }];
    
    // Return query hook
    return useApiQuery<ApiPaginatedResponse<T>>(
      queryKey,
      endpoint,
      options
    );
  };
}
