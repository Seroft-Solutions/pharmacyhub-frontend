/**
 * API Query Hooks
 * 
 * This module provides React hooks for data fetching with TanStack Query.
 */
import { 
  useQuery, 
  QueryFunctionContext,
  QueryKey,
} from '@tanstack/react-query';
import { apiClient } from '../../core/apiClient';
import { UseApiQueryOptions, PaginationParams } from '../../types/hooks';

/**
 * Hook for making GET requests with TanStack Query
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
      const response = await apiClient.get<TData>(endpoint, { 
        requiresAuth,
        deduplicate,
        timeout
      });
      
      if (response.error) {
        throw response.error;
      }
      
      return response.data as TData;
    },
    ...queryOptions
  });
}

/**
 * Hook for paginated queries
 */
export function useApiPaginatedQuery<TData, TError = Error, TQueryFnData = TData>(
  queryKey: QueryKey,
  endpoint: string,
  params: PaginationParams,
  options: UseApiQueryOptions<TData, TError, TQueryFnData> = {}
) {
  const { page, size } = params;
  const paginatedEndpoint = `${endpoint}?page=${page}&size=${size}`;
  
  return useApiQuery<TData, TError, TQueryFnData>(
    [...queryKey, { page, size }],
    paginatedEndpoint,
    options
  );
}

/**
 * Hook for infinite queries (e.g., "load more" functionality)
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
      const { pageParam = 0 } = context;
      const response = await apiClient.get<TData>(
        `${endpoint}?page=${pageParam}`,
        { requiresAuth }
      );
      
      if (response.error) {
        throw response.error;
      }
      
      return response.data as TData;
    },
    ...queryOptions
  });
}
