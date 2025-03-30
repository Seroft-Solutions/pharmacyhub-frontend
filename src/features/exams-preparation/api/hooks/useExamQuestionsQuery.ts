/**
 * Exam Questions Query Hook
 * 
 * This module provides hooks for fetching questions associated with an exam.
 * It leverages the core API module for data fetching and query caching.
 */
import { useApiQuery } from '@/core/api/hooks/query/useApiQuery';
import { QUESTION_ENDPOINTS } from '../constants/endpoints';
import { examsQueryKeys } from '../utils/queryKeys';
import { Question } from '../../types';

/**
 * Options for the exam questions query hook
 */
export interface UseExamQuestionsQueryOptions {
  enabled?: boolean;
  refetchOnWindowFocus?: boolean;
  staleTime?: number;
  cacheTime?: number;
}

/**
 * Hook for fetching questions for a specific exam
 * 
 * @param examId ID of the exam to fetch questions for
 * @param options Additional query options
 * @returns TanStack Query result with the questions data
 */
export function useExamQuestionsQuery(
  examId: number | undefined, 
  options: UseExamQuestionsQueryOptions = {}
) {
  return useApiQuery<Question[]>(
    examsQueryKeys.questions(examId as number),
    // Only call the function if examId is defined
    examId ? QUESTION_ENDPOINTS.LIST(examId) : '',
    {
      enabled: !!examId && (options.enabled !== false),
      ...options
    }
  );
}

/**
 * Hook for fetching a single question by ID
 * 
 * @param examId ID of the exam the question belongs to
 * @param questionId ID of the question to fetch
 * @param options Additional query options
 * @returns TanStack Query result with the question data
 */
export function useQuestionQuery(
  examId: number | undefined,
  questionId: number | undefined,
  options: UseExamQuestionsQueryOptions = {}
) {
  return useApiQuery<Question>(
    [
      ...examsQueryKeys.questions(examId as number),
      questionId
    ],
    // Only call the function if both IDs are defined
    examId && questionId ? QUESTION_ENDPOINTS.DETAIL(examId, questionId) : '',
    {
      enabled: !!examId && !!questionId && (options.enabled !== false),
      ...options
    }
  );
}
