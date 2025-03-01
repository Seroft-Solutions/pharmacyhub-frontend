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
  UseQueryOptions, 
  UseMutationOptions,
  QueryKey,
  QueryFunctionContext
} from '@tanstack/react-query';
import { apiClient, ApiResponse } from '../core/apiClient';

/**
 * Enhanced query options with API-specific props
 */
export interface UseApiQueryOptions<TData, TError = Error, TQueryFnData = TData> 
  extends Omit<UseQueryOptions<TData, TError, TQueryFnData>, 'queryKey' | 'queryFn'> {
  requiresAuth?: boolean;
  deduplicate?: boolean;
  timeout?: number;
}

/**
 * Enhanced mutation options with API-specific props
 */
export interface UseApiMutationOptions<TData, TError = Error, TVariables = void, TContext = unknown> 
  extends Omit<UseMutationOptions<TData, TError, TVariables, TContext>, 'mutationFn'> {
  requiresAuth?: boolean;
}

/**
 * Parameters for paginated queries
 */
export interface PaginationParams {
  page: number;
  size: number;
}

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
  endpoint: string,
  options: UseApiMutationOptions<TData, TError, TVariables, TContext> = {}
) {
  const { requiresAuth = true, ...mutationOptions } = options;
  const queryClient = useQueryClient();

  return useMutation<TData, TError, TVariables, TContext>({
    mutationFn: async (variables) => {
      const response = await apiClient.post<TData>(endpoint, variables, { 
        requiresAuth 
      });
      
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
  const { requiresAuth = true, ...mutationOptions } = options;
  const queryClient = useQueryClient();

  return useMutation<TData, TError, TVariables, TContext>({
    mutationFn: async (variables) => {
      const response = await apiClient.put<TData>(endpoint, variables, { 
        requiresAuth 
      });
      
      if (response.error) {
        throw response.error;
      }
      
      return response.data as TData;
    },
    ...mutationOptions
  });
}

/**
 * Hook for making PATCH requests (partial updates)
 */
export function useApiPatch<TData, TVariables = unknown, TError = Error, TContext = unknown>(
  endpoint: string,
  options: UseApiMutationOptions<TData, TError, TVariables, TContext> = {}
) {
  const { requiresAuth = true, ...mutationOptions } = options;
  const queryClient = useQueryClient();

  return useMutation<TData, TError, TVariables, TContext>({
    mutationFn: async (variables) => {
      const response = await apiClient.patch<TData>(endpoint, variables, { 
        requiresAuth 
      });
      
      if (response.error) {
        throw response.error;
      }
      
      return response.data as TData;
    },
    ...mutationOptions
  });
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
      
      const response = hasBody
        ? await apiClient.request<TData>(endpoint, { 
            method: 'DELETE',
            requiresAuth,
            body: JSON.stringify(variables)
          })
        : await apiClient.delete<TData>(endpoint, { requiresAuth });
      
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
