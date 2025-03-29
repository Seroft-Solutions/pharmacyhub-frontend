/**
 * API Query Hooks
 * 
 * This module provides React hooks for data fetching with TanStack Query.
 * Includes standard query, paginated query, and infinite query implementations.
 */
import { 
  useQuery, 
  QueryFunctionContext,
  QueryKey,
} from '@tanstack/react-query';
import { apiClient } from '../../core/apiClient';
import { UseApiQueryOptions, PaginationParams } from '../../types/hooks';
import { handleApiResponse } from '../../utils/requestUtils';

/**
 * Hook for making GET requests with TanStack Query
 *
 * @template TData The response data type
 * @template TError The error type
 * @template TQueryFnData The query function data type (optional)
 * @param queryKey The query key for caching
 * @param endpoint The API endpoint string
 * @param options The query options
 * @returns A TanStack query hook with proper typing
 */
export function useApiQuery<TData, TError = Error, TQueryFnData = TData>(
  queryKey: QueryKey,
  endpoint: string,
  options: UseApiQueryOptions<TData, TError, TQueryFnData> = {}
) {
  const { requiresAuth = true, deduplicate = true, timeout, ...queryOptions } = options;

  return useQuery<TData, TError, TQueryFnData>({
    queryKey,
    queryFn: async () => {
      // Execute the GET request
      const response = await apiClient.get<TData>(endpoint, { 
        requiresAuth,
        deduplicate,
        timeout
      });
      
      // Handle the response and return the data
      return handleApiResponse<TData>(response);
    },
    ...queryOptions
  });
}

/**
 * Hook for paginated queries
 *
 * @template TData The response data type
 * @template TError The error type
 * @template TQueryFnData The query function data type (optional)
 * @param queryKey The query key for caching
 * @param endpoint The API endpoint string
 * @param params The pagination parameters (page and size)
 * @param options The query options
 * @returns A TanStack query hook configured for pagination
 */
export function useApiPaginatedQuery<TData, TError = Error, TQueryFnData = TData>(
  queryKey: QueryKey,
  endpoint: string,
  params: PaginationParams,
  options: UseApiQueryOptions<TData, TError, TQueryFnData> = {}
) {
  const { page, size } = params;
  
  // Create a paginated endpoint with query parameters
  const paginatedEndpoint = `${endpoint}?page=${page}&size=${size}`;
  
  // Add pagination params to the query key for proper caching
  return useApiQuery<TData, TError, TQueryFnData>(
    [...queryKey, { page, size }],
    paginatedEndpoint,
    options
  );
}

/**
 * Hook for infinite queries (e.g., "load more" functionality)
 *
 * @template TData The response data type
 * @template TError The error type
 * @template TQueryFnData The query function data type (optional)
 * @param queryKey The query key for caching
 * @param endpoint The API endpoint string
 * @param options The query options
 * @returns A TanStack query hook configured for infinite loading
 */
export function useApiInfiniteQuery<TData, TError = Error, TQueryFnData = TData>(
  queryKey: QueryKey,
  endpoint: string,
  options: UseApiQueryOptions<TData, TError, TQueryFnData> = {}
) {
  const { requiresAuth = true, ...queryOptions } = options;

  return useQuery<TData, TError, TQueryFnData>({
    queryKey,
    queryFn: async (context: QueryFunctionContext) => {
      // Extract the pageParam from the context (default to 0)
      const { pageParam = 0 } = context;
      
      // Execute the GET request with the page parameter
      const response = await apiClient.get<TData>(
        `${endpoint}?page=${pageParam}`,
        { requiresAuth }
      );
      
      // Handle the response and return the data
      return handleApiResponse<TData>(response);
    },
    ...queryOptions
  });
}
