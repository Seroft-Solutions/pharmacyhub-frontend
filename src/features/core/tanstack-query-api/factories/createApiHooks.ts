/**
 * API Hooks Factory
 * 
 * This module provides a factory function to create standardized hooks for API operations
 * using TanStack Query. It reduces boilerplate in feature modules and ensures consistency.
 */
import { 
  useApiQuery, 
  useApiMutation,
  createQueryKeys,
  UseApiQueryOptions,
  UseApiMutationOptions,
  ApiResponse
} from '@/features/core/tanstack-query-api';
import { useQueryClient } from '@tanstack/react-query';
import type { QueryKey } from '@tanstack/react-query';

/**
 * Options for configuring API hooks
 */
export interface ApiHooksOptions {
  /** Resource name for query keys (e.g., 'users', 'products') */
  resourceName: string;
  
  /** Default stale time for queries in milliseconds */
  defaultStaleTime?: number;
  
  /** Whether most endpoints require authentication */
  requiresAuth?: boolean;
}

/**
 * Factory function to create standardized API hooks for a feature
 * 
 * @param apiEndpoints Object containing endpoint constants
 * @param options Configuration options
 * @returns Object containing standardized hooks and query keys
 */
export function createApiHooks<
  TEntity,
  TListParams = Record<string, any>,
  TCreateParams = Partial<TEntity>,
  TUpdateParams = Partial<TEntity>
>(
  apiEndpoints: Record<string, string>,
  options: ApiHooksOptions
) {
  const {
    resourceName,
    defaultStaleTime = 5 * 60 * 1000, // 5 minutes default
    requiresAuth = true
  } = options;
  
  // Create query keys for this resource
  const queryKeys = createQueryKeys({
    all: () => [resourceName] as const,
    lists: () => [...queryKeys.all(), 'list'] as const,
    list: (params?: TListParams) => [...queryKeys.lists(), params ?? {}] as const,
    details: () => [...queryKeys.all(), 'detail'] as const,
    detail: (id: string | number) => [...queryKeys.details(), id] as const,
  });
  
  /**
   * Hook for fetching a list of entities
   */
  const useList = <TData = TEntity[]>(
    params?: TListParams,
    options?: UseApiQueryOptions<TData>
  ) => {
    // Build query string from params if provided
    const queryString = params 
      ? '?' + new URLSearchParams(params as Record<string, string>).toString() 
      : '';
      
    // Use base list endpoint or search endpoint based on params
    const endpoint = apiEndpoints.list + queryString;
    
    return useApiQuery<TData>(
      queryKeys.list(params),
      endpoint,
      {
        requiresAuth,
        staleTime: defaultStaleTime,
        ...options
      }
    );
  };
  
  /**
   * Hook for fetching a single entity by ID
   */
  const useDetail = <TData = TEntity>(
    id: string | number,
    options?: UseApiQueryOptions<TData>
  ) => {
    // Replace :id placeholder in endpoint string if it exists
    const endpoint = apiEndpoints.detail.includes(':id')
      ? apiEndpoints.detail.replace(':id', id.toString())
      : `${apiEndpoints.detail}/${id}`;
    
    return useApiQuery<TData>(
      queryKeys.detail(id),
      endpoint,
      {
        requiresAuth,
        enabled: !!id,
        staleTime: defaultStaleTime,
        ...options
      }
    );
  };
  
  /**
   * Hook for creating a new entity
   */
  const useCreate = <TData = TEntity, TError = Error>(
    options?: UseApiMutationOptions<TData, TError, TCreateParams>
  ) => {
    const queryClient = useQueryClient();
    
    return useApiMutation<TData, TCreateParams, TError>(
      apiEndpoints.create,
      {
        requiresAuth,
        onSuccess: (data, variables, context) => {
          // Invalidate list queries when a new entity is created
          queryClient.invalidateQueries(queryKeys.lists());
          
          // Call custom onSuccess if provided
          if (options?.onSuccess) {
            options.onSuccess(data, variables, context);
          }
        },
        ...options
      }
    );
  };
  
  /**
   * Hook for updating an entity
   */
  const useUpdate = <TData = TEntity, TError = Error>(
    id: string | number,
    options?: UseApiMutationOptions<TData, TError, TUpdateParams>
  ) => {
    const queryClient = useQueryClient();
    
    // Replace :id placeholder in endpoint string if it exists
    const endpoint = apiEndpoints.update.includes(':id')
      ? apiEndpoints.update.replace(':id', id.toString())
      : `${apiEndpoints.update}/${id}`;
    
    return useApiMutation<TData, TUpdateParams, TError>(
      endpoint,
      {
        requiresAuth,
        onSuccess: (data, variables, context) => {
          // Invalidate specific detail query
          queryClient.invalidateQueries(queryKeys.detail(id));
          
          // Also invalidate list queries as the entity has changed
          queryClient.invalidateQueries(queryKeys.lists());
          
          // Call custom onSuccess if provided
          if (options?.onSuccess) {
            options.onSuccess(data, variables, context);
          }
        },
        ...options
      }
    );
  };
  
  /**
   * Hook for patching an entity (partial update)
   */
  const usePatch = <TData = TEntity, TError = Error>(
    id: string | number,
    options?: UseApiMutationOptions<TData, TError, Partial<TUpdateParams>>
  ) => {
    const queryClient = useQueryClient();
    
    // Replace :id placeholder in endpoint string if it exists
    const endpoint = apiEndpoints.patch ? (
      apiEndpoints.patch.includes(':id')
        ? apiEndpoints.patch.replace(':id', id.toString())
        : `${apiEndpoints.patch}/${id}`
    ) : (
      apiEndpoints.update.includes(':id')
        ? apiEndpoints.update.replace(':id', id.toString())
        : `${apiEndpoints.update}/${id}`
    );
    
    return useApiMutation<TData, Partial<TUpdateParams>, TError>(
      endpoint,
      {
        method: 'PATCH',
        requiresAuth,
        onSuccess: (data, variables, context) => {
          // Invalidate specific detail query
          queryClient.invalidateQueries(queryKeys.detail(id));
          
          // Also invalidate list queries as the entity has changed
          queryClient.invalidateQueries(queryKeys.lists());
          
          // Call custom onSuccess if provided
          if (options?.onSuccess) {
            options.onSuccess(data, variables, context);
          }
        },
        ...options
      }
    );
  };
  
  /**
   * Hook for deleting an entity
   */
  const useDelete = <TData = void, TError = Error>(
    options?: UseApiMutationOptions<TData, TError, string | number>
  ) => {
    const queryClient = useQueryClient();
    
    return useApiMutation<TData, string | number, TError>(
      (id) => {
        // Replace :id placeholder in endpoint string if it exists
        return apiEndpoints.delete.includes(':id')
          ? apiEndpoints.delete.replace(':id', id.toString())
          : `${apiEndpoints.delete}/${id}`;
      },
      {
        requiresAuth,
        onSuccess: (data, id, context) => {
          // Invalidate specific detail query
          queryClient.invalidateQueries(queryKeys.detail(id));
          
          // Also invalidate list queries as an entity was removed
          queryClient.invalidateQueries(queryKeys.lists());
          
          // Call custom onSuccess if provided
          if (options?.onSuccess) {
            options.onSuccess(data, id, context);
          }
        },
        ...options
      }
    );
  };

  /**
   * Hook for performing custom actions on an entity
   */
  const useAction = <TData = any, TParams = any, TError = Error>(
    actionEndpoint: string,
    options?: UseApiMutationOptions<TData, TError, TParams> & { 
      method?: 'POST' | 'PUT' | 'PATCH' | 'DELETE' 
    }
  ) => {
    const queryClient = useQueryClient();
    const { method = 'POST', ...mutationOptions } = options || {};
    
    return useApiMutation<TData, TParams, TError>(
      actionEndpoint,
      {
        method,
        requiresAuth,
        onSuccess: (data, variables, context) => {
          // By default, invalidate list queries when an action completes
          queryClient.invalidateQueries(queryKeys.lists());
          
          // Call custom onSuccess if provided
          if (mutationOptions?.onSuccess) {
            mutationOptions.onSuccess(data, variables, context);
          }
        },
        ...mutationOptions
      }
    );
  };
  
  /**
   * Hook for custom queries with the same query key pattern
   */
  const useCustomQuery = <TData = any, TError = Error>(
    endpointKey: string,
    customQueryKey: string | any[],
    options?: UseApiQueryOptions<TData, TError>
  ) => {
    // Ensure we have a valid endpoint
    if (!apiEndpoints[endpointKey]) {
      console.error(`Endpoint "${endpointKey}" not found in API endpoints`);
      throw new Error(`Endpoint "${endpointKey}" not found in API endpoints`);
    }
    
    // Build query key based on input
    const queryKey = typeof customQueryKey === 'string'
      ? [...queryKeys.all(), customQueryKey]
      : Array.isArray(customQueryKey)
        ? [...queryKeys.all(), ...customQueryKey]
        : [...queryKeys.all(), 'custom', endpointKey];
    
    return useApiQuery<TData, TError>(
      queryKey as QueryKey,
      apiEndpoints[endpointKey],
      {
        requiresAuth,
        staleTime: defaultStaleTime,
        ...options
      }
    );
  };
  
  // Return all hooks and query keys
  return {
    // Standard CRUD hooks
    useList,
    useDetail,
    useCreate,
    useUpdate,
    usePatch,
    useDelete,
    
    // Advanced hooks
    useAction,
    useCustomQuery,
    
    // Export query keys for custom hooks
    queryKeys
  };
}

/**
 * Creates typed query keys for a resource without creating hooks
 * Useful for custom hooks that need to integrate with the query key pattern
 */
export function createResourceQueryKeys(resourceName: string) {
  return createQueryKeys({
    all: () => [resourceName] as const,
    lists: () => [...queryKeys.all(), 'list'] as const,
    list: (params?: any) => [...queryKeys.lists(), params ?? {}] as const,
    details: () => [...queryKeys.all(), 'detail'] as const,
    detail: (id: string | number) => [...queryKeys.details(), id] as const,
    custom: (...parts: any[]) => [...queryKeys.all(), 'custom', ...parts] as const
  });
}
