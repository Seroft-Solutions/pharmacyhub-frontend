/**
 * OpenAPI TanStack Query Adapter
 * 
 * This utility provides adapters to integrate OpenAPI-generated services
 * with TanStack Query. It helps standardize the way we interact with the API
 * and manage state through TanStack Query.
 */

import { 
  QueryClient, 
  QueryKey, 
  UseMutationOptions, 
  UseQueryOptions 
} from '@tanstack/react-query';
import { AxiosError } from 'axios';

/**
 * Default error handler for OpenAPI queries and mutations
 */
export const defaultOpenApiErrorHandler = (error: unknown) => {
  if (error instanceof AxiosError) {
    console.error('API Error:', error.response?.data || error.message);
  } else {
    console.error('Unknown error:', error);
  }
};

/**
 * Factory to create a standardized query configuration
 * 
 * @param queryClient - The TanStack Query client instance
 * @returns A configuration factory for queries
 */
export const createOpenApiQueryConfig = (queryClient: QueryClient) => {
  return <TData, TError = AxiosError>(
    queryKey: QueryKey,
    options?: Omit<UseQueryOptions<TData, TError, TData>, 'queryKey'>
  ): UseQueryOptions<TData, TError, TData> => {
    return {
      queryKey,
      staleTime: 1000 * 60 * 5, // 5 minutes
      cacheTime: 1000 * 60 * 30, // 30 minutes
      refetchOnWindowFocus: true,
      refetchOnMount: true,
      refetchOnReconnect: true,
      retry: 3,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      onError: defaultOpenApiErrorHandler,
      ...options
    };
  };
};

/**
 * Factory to create standardized mutation configuration
 * 
 * @param queryClient - The TanStack Query client instance
 * @returns A configuration factory for mutations
 */
export const createOpenApiMutationConfig = (queryClient: QueryClient) => {
  return <TData, TError = AxiosError, TVariables = unknown, TContext = unknown>(
    options?: UseMutationOptions<TData, TError, TVariables, TContext>
  ): UseMutationOptions<TData, TError, TVariables, TContext> => {
    return {
      retry: 1,
      onError: defaultOpenApiErrorHandler,
      ...options
    };
  };
};
