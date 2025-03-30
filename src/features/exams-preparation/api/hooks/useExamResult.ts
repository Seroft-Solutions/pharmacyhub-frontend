/**
 * Exam Results Query Hooks
 * 
 * This module provides hooks for fetching and manipulating exam results
 * using the core API module.
 */
import { useApiQuery } from '@/core/api/hooks';
import { Result } from '../../types';
import { attemptKeys } from '../utils/queryKeys';
import { API_ENDPOINTS } from '../constants';

/**
 * Hook for fetching results for a specific exam attempt
 */
export const useExamResult = (attemptId: number, options = {}) => {
  return useApiQuery<Result>(
    attemptKeys.result(attemptId),
    API_ENDPOINTS.ATTEMPT_RESULT(attemptId),
    {
      // Results are typically more static
      staleTime: 30 * 60 * 1000, // 30 minutes
      cacheTime: 60 * 60 * 1000, // 1 hour
      ...options
    }
  );
};
