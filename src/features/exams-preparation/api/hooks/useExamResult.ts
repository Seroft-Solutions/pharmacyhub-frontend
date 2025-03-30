/**
 * Exam Results Hooks
 * 
 * This module provides hooks for fetching exam results
 * leveraging the core API module for data fetching.
 */
import { createQuery } from '@/core/api/hooks/query/useApiQuery';
import { apiClient } from '@/core/api/core/apiClient';
import { handleApiError } from '@/core/api/core/error';
import { queryKeys } from '../utils';
import { ExamAttempt } from '../services/apiHooksFactory';

/**
 * Represents detailed exam result
 */
export interface ExamResult extends ExamAttempt {
  correctAnswers: number;
  incorrectAnswers: number;
  unansweredQuestions: number;
  scoreBreakdown: {
    byTopic?: Record<string, { score: number; total: number; percentage: number }>;
    byDifficulty?: Record<string, { score: number; total: number; percentage: number }>;
  };
  detailedQuestions: Array<{
    id: number;
    question: string;
    userAnswer: any;
    correctAnswer: any;
    isCorrect: boolean;
    explanation?: string;
    topic?: string;
    difficulty?: string;
  }>;
  [key: string]: any;
}

/**
 * Options for useExamResult hook
 */
export interface UseExamResultOptions {
  enabled?: boolean;
  refetchOnWindowFocus?: boolean;
  staleTime?: number;
  cacheTime?: number;
}

/**
 * Hook for fetching exam result 
 *
 * @param attemptId ID of the attempt to fetch results for
 * @param options Additional query options
 */
export const useExamResult = (attemptId: number | undefined, options: UseExamResultOptions = {}) => {
  return createQuery<ExamResult>({
    queryKey: queryKeys.attemptKeys.result(attemptId as number),
    queryFn: async () => {
      try {
        if (!attemptId) throw new Error('Attempt ID is required');
        const { data } = await apiClient.get(`/v1/exams-preparation/attempts/${attemptId}/result`);
        return data;
      } catch (error) {
        throw handleApiError(error, {
          context: {
            feature: 'exams-preparation',
            action: 'getExamResult',
            attemptId
          }
        });
      }
    },
    enabled: !!attemptId && (options.enabled !== false),
    ...options
  });
};
