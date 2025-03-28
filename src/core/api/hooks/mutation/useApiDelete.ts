/**
 * API Delete Hook
 * 
 * This module provides a React hook for making DELETE requests.
 */
import { 
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { apiClient } from '../../core/apiClient';
import { UseApiMutationOptions } from '../../types/hooks';

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

export default useApiDelete;
