/**
 * Exam Results Query Hooks
 * 
 * This module provides hooks for fetching exam results
 * using the core API hooks factory.
 */
import { attemptsApiHooks } from '../services/apiHooksFactory';
import { Result } from '../../types';

/**
 * Hook for fetching results for a specific exam attempt
 */
export const useExamResult = (attemptId: number, options = {}) => {
  return attemptsApiHooks.useCustomQuery<Result>(
    'result',
    ['result', attemptId],
    {
      urlParams: { attemptId },
      // Results are typically more static
      staleTime: 30 * 60 * 1000, // 30 minutes
      cacheTime: 60 * 60 * 1000, // 1 hour
      ...options
    }
  );
};
