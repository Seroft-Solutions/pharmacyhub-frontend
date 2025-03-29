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
import { handleApiResponse, processEndpoint, appendQueryParams } from '../../utils/requestUtils';
import { createApiError } from '../../core/error';

/**
 * Hook for making GET requests with TanStack Query
 *
 * @template TData The response data type
 * @template TError The error type
 * @template TQueryFnData The query function data type (optional)
 * @param queryKey The query key for caching
 * @param endpoint The API endpoint string or function
 * @param options The query options
 * @returns A TanStack query hook with proper typing
 */
export function useApiQuery<TData, TError = Error, TQueryFnData = TData>(
  queryKey: QueryKey,
  endpoint: string | ((variables?: any) => string),
  options: UseApiQueryOptions<TData, TError, TQueryFnData> = {}
) {
  const { 
    requiresAuth = true, 
    deduplicate = true, 
    timeout,
    params,
    ...queryOptions 
  } = options;

  return useQuery<TData, TError, TQueryFnData>({
    queryKey,
    queryFn: async () => {
      try {
        // Process the endpoint
        const actualEndpoint = typeof endpoint === 'function'
          ? processEndpoint(endpoint, undefined)
          : endpoint;
          
        // Add query parameters if provided
        const fullEndpoint = params 
          ? appendQueryParams(actualEndpoint, params)
          : actualEndpoint;
        
        // Execute the GET request
        const response = await apiClient.get<TData>(fullEndpoint, { 
          requiresAuth,
          deduplicate,
          timeout
        });
        
        // Handle the response and return the data
        return handleApiResponse<TData>(response);
      } catch (error) {
        // Convert to a properly typed API error
        const apiError = createApiError(error);
        
        // Add contextual information to the error
        apiError.data = {
          ...apiError.data,
          endpoint: typeof endpoint === 'string' ? endpoint : '[function]',
          method: 'GET',
          queryKey,
          __requestContext: true
        };
        
        // Rethrow as TError
        throw apiError as unknown as TError;
      }
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
  endpoint: string | ((variables?: any) => string),
  params: PaginationParams,
  options: UseApiQueryOptions<TData, TError, TQueryFnData> = {}
) {
  const { page, size } = params;
  
  // Add pagination params to the query params
  const queryParams = {
    ...(options.params || {}),
    page,
    size
  };
  
  // Add pagination params to the query key for proper caching
  return useApiQuery<TData, TError, TQueryFnData>(
    [...queryKey, { page, size }],
    endpoint,
    {
      ...options,
      params: queryParams
    }
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
  endpoint: string | ((variables?: any) => string),
  options: UseApiQueryOptions<TData, TError, TQueryFnData> = {}
) {
  const { requiresAuth = true, ...queryOptions } = options;

  return useQuery<TData, TError, TQueryFnData>({
    queryKey,
    queryFn: async (context: QueryFunctionContext) => {
      try {
        // Extract the pageParam from the context (default to 0)
        const { pageParam = 0 } = context;
        
        // Process the endpoint
        const actualEndpoint = typeof endpoint === 'function'
          ? processEndpoint(endpoint, undefined)
          : endpoint;
          
        // Add the page parameter to the endpoint
        const fullEndpoint = appendQueryParams(actualEndpoint, { page: pageParam });
        
        // Execute the GET request with the page parameter
        const response = await apiClient.get<TData>(
          fullEndpoint,
          { requiresAuth }
        );
        
        // Handle the response and return the data
        return handleApiResponse<TData>(response);
      } catch (error) {
        // Convert to a properly typed API error
        const apiError = createApiError(error);
        
        // Add contextual information to the error
        apiError.data = {
          ...apiError.data,
          endpoint: typeof endpoint === 'string' ? endpoint : '[function]',
          method: 'GET',
          queryKey,
          __requestContext: true
        };
        
        // Rethrow as TError
        throw apiError as unknown as TError;
      }
    },
    ...queryOptions
  });
}
