/**
 * API Mutation Hooks
 * 
 * This module provides React hooks for data mutations with TanStack Query.
 */
import { 
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { apiClient } from '../../core/apiClient';
import { UseApiMutationOptions } from '../../types/hooks';
import { logger } from '@/shared/lib/logger';

/**
 * Validate and process the endpoint for mutations
 */
function processEndpoint<TVariables>(
  endpoint: string | ((params: TVariables) => string), 
  variables: TVariables
): string {
  // Determine the actual endpoint
  let actualEndpoint: string;
  
  if (typeof endpoint === 'function') {
    try {
      actualEndpoint = endpoint(variables);
      logger.debug('Generated dynamic endpoint:', actualEndpoint, 'from variables:', variables);
    } catch (err) {
      console.error('Error generating endpoint:', err);
      throw new Error(`Failed to generate API endpoint: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  } else {
    actualEndpoint = endpoint;
  }
  
  // Ensure we have a valid endpoint
  if (!actualEndpoint || typeof actualEndpoint !== 'string') {
    logger.error('Invalid endpoint:', actualEndpoint);
    throw new Error('Invalid API endpoint');
  }
  
  // Check for any remaining URL parameters that weren't replaced
  if (actualEndpoint.includes(':')) {
    logger.warn('Endpoint still contains unreplaced parameters:', actualEndpoint);
  }
  
  return actualEndpoint;
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
      // Process the endpoint
      const actualEndpoint = processEndpoint(endpoint, variables);
      
      // Make the API request based on the method
      let response;
      const requestConfig = { 
        requiresAuth,
        timeout: options.timeout
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
