/**
 * Exam Attempts Query Hooks
 * 
 * This module provides hooks for fetching exam attempts and results.
 * It leverages the core API module for data fetching and query caching.
 */
import { useApiQuery } from '@/core/api/hooks/query/useApiQuery';
import { ATTEMPT_ENDPOINTS } from '../constants/endpoints';
import { examsQueryKeys } from '../utils/queryKeys';
import { ExamAttempt, ExamResult } from '../../types';

/**
 * Options for the attempt queries
 */
export interface UseAttemptQueryOptions {
  enabled?: boolean;
  refetchOnWindowFocus?: boolean;
  staleTime?: number;
  cacheTime?: number;
}

/**
 * Hook for fetching all attempts for a specific exam
 * 
 * @param examId ID of the exam to fetch attempts for
 * @param options Additional query options
 * @returns TanStack Query result with the attempts data
 */
export function useExamAttemptsQuery(
  examId: number | undefined,
  options: UseAttemptQueryOptions = {}
) {
  return useApiQuery<ExamAttempt[]>(
    examsQueryKeys.attempts.byExam(examId as number),
    // Only call the function if examId is defined
    examId ? ATTEMPT_ENDPOINTS.LIST(examId) : '',
    {
      enabled: !!examId && (options.enabled !== false),
      ...options
    }
  );
}

/**
 * Hook for fetching a single attempt by ID
 * 
 * @param attemptId ID of the attempt to fetch
 * @param options Additional query options
 * @returns TanStack Query result with the attempt data
 */
export function useAttemptQuery(
  attemptId: string | undefined,
  options: UseAttemptQueryOptions = {}
) {
  return useApiQuery<ExamAttempt>(
    examsQueryKeys.attempts.detail(attemptId as any),
    // Only call the function if attemptId is defined
    attemptId ? ATTEMPT_ENDPOINTS.DETAIL(attemptId) : '',
    {
      enabled: !!attemptId && (options.enabled !== false),
      ...options
    }
  );
}

/**
 * Hook for fetching result for a specific attempt
 * 
 * @param attemptId ID of the attempt to fetch results for
 * @param options Additional query options
 * @returns TanStack Query result with the result data
 */
export function useAttemptResultQuery(
  attemptId: string | undefined,
  options: UseAttemptQueryOptions = {}
) {
  return useApiQuery<ExamResult>(
    examsQueryKeys.attempts.result(attemptId as any),
    // Only call the function if attemptId is defined
    attemptId ? ATTEMPT_ENDPOINTS.RESULTS(attemptId) : '',
    {
      enabled: !!attemptId && (options.enabled !== false),
      ...options
    }
  );
}
