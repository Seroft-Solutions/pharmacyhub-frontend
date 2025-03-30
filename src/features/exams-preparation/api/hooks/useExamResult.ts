/**
 * Exam Result Hooks
 * 
 * This module provides hooks for fetching exam results.
 */

import { createQueryHook } from './hookFactory';
import { examService } from '../services';
import { ExamResult } from '../../types/models/exam';

/**
 * Hook for fetching a result for a specific exam attempt
 */
export const useExamResult = createQueryHook<ExamResult, string>(
  'examResult',
  async (attemptId) => {
    return examService.getResultByAttemptId(attemptId);
  }
);

/**
 * Hook for fetching all results for a specific exam
 */
export const useExamResults = createQueryHook<ExamResult[], number>(
  'examResults',
  async (examId) => {
    return examService.getResultsByExamId(examId);
  }
);

/**
 * Hook for fetching all results for the current user
 */
export const useUserResults = createQueryHook<ExamResult[], void>(
  'userResults',
  async () => {
    return examService.getUserResults();
  },
  {
    staleTime: 5 * 60 * 1000, // 5 minutes
  }
);

/**
 * Hook for getting the best result for an exam
 */
export const useBestExamResult = createQueryHook<ExamResult | null, number>(
  'bestExamResult',
  async (examId) => {
    const results = await examService.getResultsByExamId(examId);
    
    if (results.length === 0) {
      return null;
    }
    
    // Find the result with the highest score
    return results.reduce((best, current) => {
      return current.score > best.score ? current : best;
    }, results[0]);
  }
);
