/**
 * API Delete Hook
 * 
 * This module provides a React hook for making DELETE requests.
 * Handles both simple DELETE requests and DELETE with body content.
 */
import { 
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { apiClient } from '../../core/apiClient';
import { UseApiMutationOptions } from '../../types/hooks';
import { handleApiResponse } from '../../utils/requestUtils';

/**
 * Hook for making DELETE requests
 *
 * @template TData The response data type
 * @template TVariables The request variables type (optional)
 * @template TError The error type
 * @template TContext The context type for mutation
 * @param endpoint The API endpoint string
 * @param options The mutation options
 * @returns A TanStack mutation hook configured for DELETE operations
 */
export function useApiDelete<TData, TVariables = void, TError = Error, TContext = unknown>(
  endpoint: string,
  options: UseApiMutationOptions<TData, TError, TVariables, TContext> = {}
) {
  const { requiresAuth = true, ...mutationOptions } = options;
  const queryClient = useQueryClient();

  return useMutation<TData, TError, TVariables, TContext>({
    mutationFn: async (variables) => {
      // Check if we need to send body content with DELETE
      const hasBody = variables !== undefined && variables !== null && variables !== void 0;
      
      // Execute the appropriate DELETE request based on whether we have body content
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
      
      // Handle the response and return the data
      return handleApiResponse<TData>(response);
    },
    ...mutationOptions
  });
}

export default useApiDelete;
