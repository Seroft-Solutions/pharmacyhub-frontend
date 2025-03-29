/**
 * OpenAPI Query Hook
 * 
 * This hook integrates the generated OpenAPI clients with TanStack Query.
 * It provides a consistent interface for querying data from API endpoints
 * generated from OpenAPI specifications.
 */

import { 
  QueryKey, 
  UseQueryOptions, 
  UseQueryResult, 
  useQuery 
} from '@tanstack/react-query';

/**
 * Hook to use generated OpenAPI service methods with TanStack Query
 * 
 * @param queryKey - The query key for cache management
 * @param serviceFn - The OpenAPI service function to call
 * @param options - Additional TanStack Query options
 * @returns UseQueryResult from TanStack Query
 */
export function useOpenApiQuery<TData, TError = unknown>(
  queryKey: QueryKey,
  serviceFn: () => Promise<TData>,
  options?: Omit<UseQueryOptions<TData, TError, TData>, 'queryKey' | 'queryFn'>
): UseQueryResult<TData, TError> {
  return useQuery<TData, TError>({
    queryKey,
    queryFn: serviceFn,
    ...options
  });
}

/**
 * Creates a query hook for specific OpenAPI service methods
 * 
 * @param createQueryKey - Function to create a consistent query key
 * @returns A custom hook for the specific service
 */
export function createOpenApiQueryHook<TParams extends unknown[], TData, TError = unknown>(
  createQueryKey: (...params: TParams) => QueryKey
) {
  return function useServiceQuery(
    serviceFn: (...params: TParams) => Promise<TData>,
    params: TParams,
    options?: Omit<UseQueryOptions<TData, TError, TData>, 'queryKey' | 'queryFn'>
  ): UseQueryResult<TData, TError> {
    const queryKey = createQueryKey(...params);
    return useQuery<TData, TError>({
      queryKey,
      queryFn: () => serviceFn(...params),
      ...options
    });
  };
}
