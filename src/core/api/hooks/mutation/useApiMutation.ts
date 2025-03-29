/**
 * API Mutation Hooks
 * 
 * This module provides React hooks for data mutations with TanStack Query.
 * These hooks handle POST, PUT, PATCH operations with proper typing and error handling.
 */
import { 
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { apiClient } from '../../core/apiClient';
import { UseApiMutationOptions } from '../../types/hooks';
import { processEndpoint, handleApiResponse } from '../../utils/requestUtils';
import { createApiError, ValidationError } from '../../core/error';

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
      try {
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
      } catch (error) {
        // Convert to a properly typed API error
        const apiError = createApiError(error);
        
        // Add contextual information to the error
        apiError.data = {
          ...apiError.data,
          endpoint,
          method,
          __requestContext: true
        };
        
        // Rethrow as TError
        throw apiError as unknown as TError;
      }
    },
    ...mutationOptions
  });
}

/**
 * Hook for making PUT requests (full updates)
 * 
 * @template TData The response data type
 * @template TVariables The request variables type
 * @template TError The error type
 * @template TContext The context type for mutation
 * @param endpoint The API endpoint string or function that generates the endpoint
 * @param options The mutation options
 * @returns A TanStack mutation hook for PUT requests
 */
export function useApiPut<TData, TVariables = unknown, TError = Error, TContext = unknown>(
  endpoint: string | ((params: TVariables) => string),
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
 * 
 * @template TData The response data type
 * @template TVariables The request variables type
 * @template TError The error type
 * @template TContext The context type for mutation
 * @param endpoint The API endpoint string or function that generates the endpoint
 * @param options The mutation options
 * @returns A TanStack mutation hook for PATCH requests
 */
export function useApiPatch<TData, TVariables = unknown, TError = Error, TContext = unknown>(
  endpoint: string | ((params: TVariables) => string),
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
