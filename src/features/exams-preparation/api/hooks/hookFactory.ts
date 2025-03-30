/**
 * Hook Factory for Exams Preparation
 * 
 * This module provides factory functions for creating consistent
 * React Query hooks for the exams-preparation feature.
 */

import { 
  useQuery, 
  useMutation, 
  UseQueryOptions, 
  UseMutationOptions,
  QueryClient,
  QueryKey
} from '@tanstack/react-query';
import { apiClient } from '@/core/api';

// Create a consistent query key generator
export const createQueryKey = (baseKey: string, params?: any): QueryKey => {
  if (!params) return [baseKey];
  return [baseKey, params];
};

// Factory for creating query hooks
export function createQueryHook<TData, TParams = void>(
  baseKey: string,
  queryFn: (params: TParams) => Promise<TData>,
  defaultOptions?: Omit<UseQueryOptions<TData, Error, TData, QueryKey>, 'queryKey' | 'queryFn'>
) {
  return (params: TParams, options?: Omit<UseQueryOptions<TData, Error, TData, QueryKey>, 'queryKey' | 'queryFn'>) => {
    const queryKey = createQueryKey(baseKey, params);
    
    return useQuery<TData, Error>({
      queryKey,
      queryFn: () => queryFn(params),
      ...defaultOptions,
      ...options,
    });
  };
}

// Factory for creating mutation hooks
export function createMutationHook<TData, TVariables>(
  mutationFn: (variables: TVariables) => Promise<TData>,
  options?: Omit<UseMutationOptions<TData, Error, TVariables>, 'mutationFn'>
) {
  return (mutationOptions?: Omit<UseMutationOptions<TData, Error, TVariables>, 'mutationFn'>) => {
    return useMutation<TData, Error, TVariables>({
      mutationFn,
      ...options,
      ...mutationOptions,
    });
  };
}

// Re-export common invalidation utilities
export const invalidateQueries = (queryClient: QueryClient, queryKey: string | string[]) => {
  const key = Array.isArray(queryKey) ? queryKey : [queryKey];
  return queryClient.invalidateQueries({ queryKey: key });
};

// Re-export prefetch utility
export const prefetchQuery = async <TData>(
  queryClient: QueryClient,
  queryKey: QueryKey,
  queryFn: () => Promise<TData>,
  options?: UseQueryOptions<TData, Error, TData, QueryKey>
) => {
  return queryClient.prefetchQuery({
    queryKey,
    queryFn,
    ...options,
  });
};
