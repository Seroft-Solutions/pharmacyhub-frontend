/**
 * TanStack Query API Hooks
 * 
 * This module provides React hooks that integrate TanStack Query
 * with our API client for data fetching and mutations.
 */
import { 
  useQuery, 
  useMutation, 
  useQueryClient,
  QueryFunctionContext,
  QueryKey,
} from '@tanstack/react-query';
import { apiClient, ApiResponse } from '../core/apiClient';
import { 
  UseApiQueryOptions, 
  UseApiMutationOptions, 
  PaginationParams 
} from '../types/hooks';

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
 * Hook for making POST requests (create operations)
 */
export function useApiMutation<TData, TVariables = unknown, TError = Error, TContext = unknown>(
  endpoint: string | ((params: TVariables) => string),
  options: UseApiMutationOptions<TData, TError, TVariables, TContext> & {
    method?: 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  } = {}
) {
  const { requiresAuth = true, method = 'POST', ...mutationOptions } = options;
  const queryClient = useQueryClient();

  return useMutation<TData, TError, TVariables, TContext>({
    mutationFn: async (variables) => {
      // Determine the actual endpoint
      let actualEndpoint: string;
      
      if (typeof endpoint === 'function') {
        try {
          actualEndpoint = endpoint(variables);
          console.log('Generated dynamic endpoint:', actualEndpoint, 'from variables:', variables);
        } catch (err) {
          console.error('Error generating endpoint:', err);
          throw new Error(`Failed to generate API endpoint: ${err instanceof Error ? err.message : 'Unknown error'}`);
        }
      } else {
        actualEndpoint = endpoint;
      }
      
      // Ensure we have a valid endpoint
      if (!actualEndpoint || typeof actualEndpoint !== 'string') {
        console.error('Invalid endpoint:', actualEndpoint);
        throw new Error('Invalid API endpoint');
      }
      
      // Check for any remaining URL parameters that weren't replaced
      if (actualEndpoint.includes(':')) {
        console.warn('Endpoint still contains unreplaced parameters:', actualEndpoint);
      }
      
      // Make the API request based on the method
      let response;
      const requestConfig = { 
        requiresAuth,
        timeout: options.timeout // Pass timeout to the request if provided
      };

      switch (method) {
        case 'PUT':
          response = await apiClient.put<TData>(actualEndpoint, variables, requestConfig);
          break;
        case 'PATCH':
          response = await apiClient.patch<TData>(actualEndpoint, variables, requestConfig);
          break;
        case 'DELETE':
          response = await apiClient.delete<TData>(actualEndpoint, requestConfig);
          break;
        case 'POST':
        default:
          response = await apiClient.post<TData>(actualEndpoint, variables, requestConfig);
          break;
      }
      
      if (response.error) {
        throw response.error;
      }
      
      return response.data as TData;
    },
    ...mutationOptions
  });
}

/**
 * Hook for making PUT requests (full updates)
 */
export function useApiPut<TData, TVariables = unknown, TError = Error, TContext = unknown>(
  endpoint: string,
  options: UseApiMutationOptions<TData, TError, TVariables, TContext> = {}
) {
  return useApiMutation<TData, TVariables, TError, TContext>(
    endpoint, 
    { 
      ...options,
      method: 'PUT'
    }
  );
}

/**
 * Hook for making PATCH requests (partial updates)
 */
export function useApiPatch<TData, TVariables = unknown, TError = Error, TContext = unknown>(
  endpoint: string,
  options: UseApiMutationOptions<TData, TError, TVariables, TContext> = {}
) {
  return useApiMutation<TData, TVariables, TError, TContext>(
    endpoint, 
    { 
      ...options,
      method: 'PATCH'
    }
  );
}

/**
 * Hook for making DELETE requests
 */
export function useApiDelete<TData, TVariables = void, TError = Error, TContext = unknown>(
  endpoint: string,
  options: UseApiMutationOptions<TData, TError, TVariables, TContext> = {}
) {
  const { requiresAuth = true, ...mutationOptions } = options;
  const queryClient = useQueryClient();

  return useMutation<TData, TError, TVariables, TContext>({
    mutationFn: async (variables) => {
      // For DELETE with body content
      const hasBody = variables !== undefined && variables !== null && variables !== void 0;
      
      let response;
      if (hasBody) {
        response = await apiClient.request<TData>(endpoint, { 
          method: 'DELETE',
          requiresAuth,
          body: JSON.stringify(variables)
        });
      } else {
        response = await apiClient.delete<TData>(endpoint, { requiresAuth });
      }
      
      if (response.error) {
        throw response.error;
      }
      
      return response.data as TData;
    },
    ...mutationOptions
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

/**
 * Type-safe utility for building query keys
 */
export const createQueryKeys = <T extends Record<string, (...args: any[]) => QueryKey>>(keys: T) => keys;
