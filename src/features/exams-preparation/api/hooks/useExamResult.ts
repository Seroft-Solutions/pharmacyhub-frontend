/**
 * Exam Results Query Hooks
 * 
 * This module provides hooks for fetching and manipulating exam results
 * using the core API module with proper error handling.
 */
import { useApiQuery } from '@/core/api/hooks';
import { Result } from '../../types';
import { attemptKeys } from '../utils/queryKeys';
import { API_ENDPOINTS } from '../constants';
import { handleExamError } from '../utils/errorHandler';

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
      onError: (error) => {
        // Use core error handling with exam-specific context
        handleExamError(error, { 
          attemptId,
          action: 'fetch-result',
          endpoint: API_ENDPOINTS.ATTEMPT_RESULT(attemptId)
        });
      },
      ...options
    }
  );
};
