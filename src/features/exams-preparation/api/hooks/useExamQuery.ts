/**
 * Single Exam Query Hook
 * 
 * This module provides hooks for fetching a single exam and its details.
 * It leverages the core API module for data fetching and query caching.
 */
import { useApiQuery } from '@/core/api/hooks/query/useApiQuery';
import { EXAM_ENDPOINTS } from '../constants/endpoints';
import { examsQueryKeys } from '../utils/queryKeys';
import { Exam } from '../../types';

/**
 * Options for the exam query hook
 */
export interface UseExamQueryOptions {
  enabled?: boolean;
  refetchOnWindowFocus?: boolean;
  staleTime?: number;
  cacheTime?: number;
}

/**
 * Hook for fetching a single exam by ID
 * 
 * @param examId ID of the exam to fetch
 * @param options Additional query options
 * @returns TanStack Query result with the exam data
 */
export function useExamQuery(examId: number | undefined, options: UseExamQueryOptions = {}) {
  return useApiQuery<Exam>(
    examsQueryKeys.detail(examId as number),
    // Only call the function if examId is defined
    examId ? EXAM_ENDPOINTS.DETAIL(examId) : '',
    {
      enabled: !!examId && (options.enabled !== false),
      ...options
    }
  );
}

/**
 * Hook for fetching exam statistics
 * 
 * @param options Query options
 * @returns TanStack Query result with exam statistics
 */
export function useExamStatsQuery(options: UseExamQueryOptions = {}) {
  return useApiQuery(
    examsQueryKeys.stats(),
    EXAM_ENDPOINTS.STATS,
    options
  );
}
