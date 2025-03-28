/**
 * API Hook Types
 * 
 * This module provides TypeScript types for API hooks
 */
import { 
  UseQueryOptions, 
  UseMutationOptions,
  QueryKey,
} from '@tanstack/react-query';

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
  timeout?: number;
}

/**
 * Parameters for paginated queries
 */
export interface PaginationParams {
  page: number;
  size: number;
}
