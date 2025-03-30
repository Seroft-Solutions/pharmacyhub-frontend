/**
 * Exams List Query Hook
 * 
 * This module provides hooks for fetching lists of exams with filtering and pagination.
 * It leverages the core API module for data fetching and query caching.
 */
import { useApiQuery } from '@/core/api/hooks/query/useApiQuery';
import { EXAM_ENDPOINTS } from '../constants/endpoints';
import { examsQueryKeys } from '../utils/queryKeys';
import { Exam, ExamStatus, PaginatedResponse } from '../../types';

/**
 * Options for the exams query hook
 */
export interface UseExamsQueryOptions {
  page?: number;
  limit?: number;
  status?: ExamStatus;
  search?: string;
  isPremium?: boolean;
  sortBy?: string;
  sortDir?: 'asc' | 'desc';
  tag?: string;
  enabled?: boolean;
}

/**
 * Hook for fetching a paginated list of exams with optional filtering
 * 
 * @param options Query options including pagination and filters
 * @returns TanStack Query result with the exams data
 */
export function useExamsQuery(options: UseExamsQueryOptions = {}) {
  const {
    page = 1,
    limit = 10,
    status,
    search,
    isPremium,
    sortBy,
    sortDir,
    tag,
    enabled = true,
  } = options;

  // Build query parameters
  const params = {
    page,
    limit,
    ...(status && { status }),
    ...(search && { search }),
    ...(isPremium !== undefined && { isPremium }),
    ...(sortBy && { sortBy }),
    ...(sortDir && { sortDir }),
    ...(tag && { tag }),
  };

  return useApiQuery<PaginatedResponse<Exam>>(
    examsQueryKeys.lists(params),
    EXAM_ENDPOINTS.LIST,
    {
      params,
      enabled,
    }
  );
}

/**
 * Hook for fetching published exams
 * 
 * @param options Query options
 * @returns TanStack Query result with published exams
 */
export function usePublishedExamsQuery(options: Omit<UseExamsQueryOptions, 'status'> = {}) {
  const { page = 1, limit = 10, enabled = true, ...rest } = options;

  // Build query parameters
  const params = {
    page,
    limit,
    ...rest,
  };

  return useApiQuery<PaginatedResponse<Exam>>(
    examsQueryKeys.published(),
    EXAM_ENDPOINTS.PUBLISHED,
    {
      params,
      enabled,
    }
  );
}

/**
 * Hook for fetching exams by status
 * 
 * @param status The exam status to filter by
 * @param options Other query options
 * @returns TanStack Query result with filtered exams
 */
export function useExamsByStatusQuery(
  status: ExamStatus,
  options: Omit<UseExamsQueryOptions, 'status'> = {}
) {
  const { page = 1, limit = 10, enabled = true, ...rest } = options;

  // Build query parameters
  const params = {
    page,
    limit,
    ...rest,
  };

  return useApiQuery<PaginatedResponse<Exam>>(
    examsQueryKeys.byStatus(status),
    EXAM_ENDPOINTS.BY_STATUS(status.toString()),
    {
      params,
      enabled: enabled && !!status,
    }
  );
}
