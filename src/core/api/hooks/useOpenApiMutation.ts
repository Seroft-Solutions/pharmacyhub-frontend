/**
 * OpenAPI Mutation Hook
 * 
 * This hook integrates the generated OpenAPI clients with TanStack Query mutations.
 * It provides a consistent interface for mutating data through API endpoints
 * generated from OpenAPI specifications.
 */

import { 
  QueryClient, 
  UseMutationOptions, 
  UseMutationResult, 
  useMutation 
} from '@tanstack/react-query';

/**
 * Hook to use generated OpenAPI service methods with TanStack Query mutations
 * 
 * @param serviceFn - The OpenAPI service function to call
 * @param options - Additional TanStack Query mutation options
 * @returns UseMutationResult from TanStack Query
 */
export function useOpenApiMutation<TParams, TData, TError = unknown, TContext = unknown>(
  serviceFn: (params: TParams) => Promise<TData>,
  options?: Omit<UseMutationOptions<TData, TError, TParams, TContext>, 'mutationFn'>
): UseMutationResult<TData, TError, TParams, TContext> {
  return useMutation<TData, TError, TParams, TContext>({
    mutationFn: serviceFn,
    ...options
  });
}

/**
 * Creates a mutation factory for specific OpenAPI service methods
 * 
 * @param queryClient - The TanStack Query client instance
 * @returns A function to create mutations for specific services
 */
export function createOpenApiMutationFactory(queryClient: QueryClient) {
  return function createMutation<TParams, TData, TError = unknown, TContext = unknown>(
    serviceFn: (params: TParams) => Promise<TData>,
    options?: Omit<UseMutationOptions<TData, TError, TParams, TContext>, 'mutationFn'>
  ) {
    return function useServiceMutation(
      mutationOptions?: Omit<UseMutationOptions<TData, TError, TParams, TContext>, 'mutationFn'>
    ): UseMutationResult<TData, TError, TParams, TContext> {
      return useMutation<TData, TError, TParams, TContext>({
        mutationFn: serviceFn,
        ...options,
        ...mutationOptions
      });
    };
  };
}
