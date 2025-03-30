/**
 * Exam Attempt Hooks
 * 
 * This module provides hooks for managing exam attempts
 * leveraging the core API module for data fetching and mutations.
 */
import { createQuery } from '@/core/api/hooks/query/useApiQuery';
import { createMutation } from '@/core/api/hooks/mutation/useApiMutation';
import { apiClient } from '@/core/api/core/apiClient';
import { handleApiError } from '@/core/api/core/error';
import { attemptsApiHooks, ExamAttempt } from '../services/apiHooksFactory';
import { queryKeys } from '../utils';

/**
 * Options for useExamAttempt hook
 */
export interface UseExamAttemptOptions {
  enabled?: boolean;
  refetchOnWindowFocus?: boolean;
  staleTime?: number;
  cacheTime?: number;
}

/**
 * Answer submission payload
 */
export interface AnswerSubmission {
  answerId?: number;
  answerText?: string;
  selected?: boolean | string[];
  isCorrect?: boolean;
  [key: string]: any;
}

/**
 * Hook for fetching an exam attempt
 *
 * @param attemptId ID of the attempt to fetch
 * @param options Additional query options
 */
export const useExamAttempt = (attemptId: number | undefined, options: UseExamAttemptOptions = {}) => {
  return createQuery<ExamAttempt>({
    queryKey: queryKeys.attemptKeys.detail(attemptId as number),
    queryFn: async () => {
      try {
        if (!attemptId) throw new Error('Attempt ID is required');
        const { data } = await apiClient.get(`/v1/exams-preparation/attempts/${attemptId}`);
        return data;
      } catch (error) {
        throw handleApiError(error, {
          context: {
            feature: 'exams-preparation',
            action: 'getExamAttempt',
            attemptId
          }
        });
      }
    },
    enabled: !!attemptId && (options.enabled !== false),
    ...options
  });
};

/**
 * Hook for fetching all attempts for an exam
 *
 * @param examId ID of the exam to fetch attempts for
 * @param options Additional query options
 */
export const useExamAttempts = (examId: number | undefined, options: UseExamAttemptOptions = {}) => {
  return createQuery<ExamAttempt[]>({
    queryKey: queryKeys.attemptKeys.byExam(examId as number),
    queryFn: async () => {
      try {
        if (!examId) throw new Error('Exam ID is required');
        const { data } = await apiClient.get(`/v1/exams-preparation/${examId}/attempts`);
        return data;
      } catch (error) {
        throw handleApiError(error, {
          context: {
            feature: 'exams-preparation',
            action: 'getExamAttempts',
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
 * Hook for starting a new exam attempt
 */
export const useStartExamAttempt = () => {
  return createMutation<ExamAttempt, number>({
    mutationFn: async (examId) => {
      try {
        const { data } = await apiClient.post(`/v1/exams-preparation/${examId}/start`);
        return data;
      } catch (error) {
        throw handleApiError(error, {
          context: {
            feature: 'exams-preparation',
            action: 'startExamAttempt',
            examId
          }
        });
      }
    },
    onSuccess: (_, examId, context) => {
      // Invalidate exam attempts list for this exam
      context?.queryClient.invalidateQueries({
        queryKey: queryKeys.attemptKeys.byExam(examId)
      });
    }
  });
};

/**
 * Hook for submitting an exam attempt
 */
export const useSubmitExamAttempt = () => {
  return createMutation<ExamAttempt, number>({
    mutationFn: async (attemptId) => {
      try {
        const { data } = await apiClient.post(`/v1/exams-preparation/attempts/${attemptId}/submit`);
        return data;
      } catch (error) {
        throw handleApiError(error, {
          context: {
            feature: 'exams-preparation',
            action: 'submitExamAttempt',
            attemptId
          }
        });
      }
    },
    onSuccess: (data, attemptId, context) => {
      // Invalidate the attempt itself
      context?.queryClient.invalidateQueries({
        queryKey: queryKeys.attemptKeys.detail(attemptId)
      });

      // Invalidate attempt result
      context?.queryClient.invalidateQueries({
        queryKey: queryKeys.attemptKeys.result(attemptId)
      });

      // If we know the exam ID, invalidate its attempts
      if (data?.examId) {
        context?.queryClient.invalidateQueries({
          queryKey: queryKeys.attemptKeys.byExam(data.examId)
        });
      }
    }
  });
};

/**
 * Hook for saving an answer to a question in an exam attempt
 */
export const useSaveAnswer = () => {
  return createMutation<
    any, 
    { attemptId: number; questionId: number; answer: AnswerSubmission }
  >({
    mutationFn: async ({ attemptId, questionId, answer }) => {
      try {
        const { data } = await apiClient.post(
          `/v1/exams-preparation/attempts/${attemptId}/answer/${questionId}`,
          answer
        );
        return data;
      } catch (error) {
        throw handleApiError(error, {
          context: {
            feature: 'exams-preparation',
            action: 'saveAnswer',
            attemptId,
            questionId
          }
        });
      }
    },
    onSuccess: (_, variables, context) => {
      // Invalidate the attempt as it will have updated answers
      context?.queryClient.invalidateQueries({
        queryKey: queryKeys.attemptKeys.detail(variables.attemptId)
      });
    }
  });
};

/**
 * Hook for flagging a question in an exam attempt
 */
export const useFlagQuestion = () => {
  return createMutation<
    any,
    { attemptId: number; questionId: number; isFlagged: boolean }
  >({
    mutationFn: async ({ attemptId, questionId, isFlagged }) => {
      try {
        const { data } = await apiClient.post(
          `/v1/exams-preparation/attempts/${attemptId}/flag/${questionId}`,
          { isFlagged }
        );
        return data;
      } catch (error) {
        throw handleApiError(error, {
          context: {
            feature: 'exams-preparation',
            action: 'flagQuestion',
            attemptId,
            questionId
          }
        });
      }
    },
    onSuccess: (_, variables, context) => {
      // Invalidate the attempt as it will have updated flags
      context?.queryClient.invalidateQueries({
        queryKey: queryKeys.attemptKeys.detail(variables.attemptId)
      });
    }
  });
};
