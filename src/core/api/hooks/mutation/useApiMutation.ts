/**
 * API Mutation Hooks
 * 
 * This module provides React hooks for data mutations with TanStack Query.
 * These hooks handle POST, PUT, PATCH, and DELETE operations with proper typing and error handling.
 */
import { 
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { apiClient } from '../../core/apiClient';
import { UseApiMutationOptions } from '../../types/hooks';
import { processEndpoint, handleApiResponse } from '../../utils/requestUtils';
import { logger } from '@/shared/lib/logger';

/**
 * Hook for making POST requests (create operations)
 */
/**
 * Hook for making data mutations (POST, PUT, PATCH, DELETE)
 * 
 * @template TData The response data type
 * @template TVariables The request variables type
 * @template TError The error type
 * @template TContext The context type for mutation
 * @param endpoint The API endpoint string or function that generates the endpoint
 * @param options The mutation options
 * @returns A TanStack mutation hook with proper typing
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
      // Process the endpoint
      const actualEndpoint = processEndpoint(endpoint, variables);
      
      // Make the API request based on the method
      let response;
      const requestConfig = { 
        requiresAuth,
        timeout: options.timeout
      };

      // Execute the appropriate API method based on the provided method option
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
      
      // Handle the response and return the data
      return handleApiResponse<TData>(response);
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
