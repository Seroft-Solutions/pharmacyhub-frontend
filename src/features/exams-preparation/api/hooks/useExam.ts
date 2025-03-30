/**
 * Single Exam Query Hooks
 * 
 * This module provides hooks for fetching and manipulating a single exam
 * leveraging the core API module for data fetching and mutations.
 */
import { createQuery } from '@/core/api/hooks/query/useApiQuery';
import { examsApiHooks } from '../services/apiHooksFactory';
import { queryKeys } from '../utils';
import { Exam, Question } from '../../types';
import { handleApiError } from '@/core/api/core/error';

/**
 * Options for useExam hook
 */
export interface UseExamOptions {
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
 */
export const useExam = (examId: number | undefined, options: UseExamOptions = {}) => {
  return createQuery<Exam>({
    queryKey: queryKeys.examsQueryKeys.detail(examId as number),
    queryFn: async () => {
      try {
        if (!examId) throw new Error('Exam ID is required');
        const { data } = await examsApiHooks.client.get(`/v1/exams-preparation/${examId}`);
        return data;
      } catch (error) {
        throw handleApiError(error, { 
          context: { 
            feature: 'exams-preparation',
            action: 'getExam',
            examId 
          }
        });
      }
    },
    enabled: !!examId && (options.enabled !== false),
    ...options
  });
};

/**
 * Hook for fetching questions for a specific exam
 * 
 * @param examId ID of the exam to fetch questions for
 * @param options Additional query options
 */
export const useExamQuestions = (examId: number | undefined, options: UseExamOptions = {}) => {
  return createQuery<Question[]>({
    queryKey: queryKeys.examsQueryKeys.questions(examId as number),
    queryFn: async () => {
      try {
        if (!examId) throw new Error('Exam ID is required');
        const { data } = await examsApiHooks.client.get(`/v1/exams-preparation/${examId}/questions`);
        return data;
      } catch (error) {
        throw handleApiError(error, { 
          context: { 
            feature: 'exams-preparation',
            action: 'getExamQuestions',
            examId 
          }
        });
      }
    },
    enabled: !!examId && (options.enabled !== false),
    ...options
  });
};

/**
 * Hook for adding a question to an exam
 */
export const useAddQuestion = () => {
  return examsApiHooks.useAction<
    Question,
    { examId: number; question: Omit<Question, 'id'> }
  >(
    ({ examId }) => queryKeys.examsQueryKeys.questions(examId),
    {
      method: 'POST',
      onSuccess: (_, variables, context) => {
        // Invalidate relevant queries on success
        context?.queryClient.invalidateQueries({
          queryKey: queryKeys.examsQueryKeys.questions(variables.examId)
        });
        
        // Also invalidate the exam itself as question count may change
        context?.queryClient.invalidateQueries({
          queryKey: queryKeys.examsQueryKeys.detail(variables.examId)
        });
      }
    }
  );
};

/**
 * Hook for updating a question
 */
export const useUpdateQuestion = () => {
  return examsApiHooks.useAction<
    Question,
    { examId: number; questionId: number; question: Partial<Question> }
  >(
    ({ examId, questionId }) => [
      ...queryKeys.examsQueryKeys.questions(examId), 
      'update', 
      questionId
    ],
    {
      method: 'PUT',
      endpoint: ({ examId, questionId }) => 
        `/v1/exams-preparation/${examId}/questions/${questionId}`,
      getRequestBody: ({ question }) => question,
      onSuccess: (_, variables, context) => {
        // Invalidate relevant queries on success
        context?.queryClient.invalidateQueries({
          queryKey: queryKeys.examsQueryKeys.questions(variables.examId)
        });
      }
    }
  );
};

/**
 * Hook for deleting a question
 */
export const useDeleteQuestion = () => {
  return examsApiHooks.useAction<
    void,
    { examId: number; questionId: number }
  >(
    ({ examId, questionId }) => [
      ...queryKeys.examsQueryKeys.questions(examId), 
      'delete', 
      questionId
    ],
    {
      method: 'DELETE',
      endpoint: ({ examId, questionId }) => 
        `/v1/exams-preparation/${examId}/questions/${questionId}`,
      onSuccess: (_, variables, context) => {
        // Invalidate relevant queries on success
        context?.queryClient.invalidateQueries({
          queryKey: queryKeys.examsQueryKeys.questions(variables.examId)
        });
        
        // Also invalidate the exam itself as question count may change
        context?.queryClient.invalidateQueries({
          queryKey: queryKeys.examsQueryKeys.detail(variables.examId)
        });
      }
    }
  );
};
