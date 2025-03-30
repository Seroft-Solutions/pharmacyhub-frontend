/**
 * Attempt Mutations Hooks
 * 
 * This module provides hooks for starting, updating, and submitting exam attempts.
 * It leverages the core API module for data mutations and query invalidation.
 */
import { useApiMutation } from '@/core/api/hooks/mutation/useApiMutation';
import { ATTEMPT_ENDPOINTS } from '../constants/endpoints';
import { examsQueryKeys } from '../utils/queryKeys';
import { ExamAttempt, ExamAnswer, ExamResult } from '../../types';

/**
 * Interface for starting an exam attempt
 */
export interface StartAttemptPayload {
  examId: number;
}

/**
 * Interface for submitting an answer during an exam attempt
 */
export interface SubmitAnswerPayload {
  attemptId: string;
  answer: {
    questionId: number;
    selectedOptions?: string[];
    textAnswer?: string;
  };
}

/**
 * Interface for submitting a completed exam attempt
 */
export interface SubmitAttemptPayload {
  attemptId: string;
}

/**
 * Hook for starting a new exam attempt
 * 
 * @returns TanStack Mutation hook for starting attempts
 */
export function useStartAttemptMutation() {
  return useApiMutation<ExamAttempt, StartAttemptPayload>(
    ({ examId }) => ATTEMPT_ENDPOINTS.START(examId),
    {
      onSuccess: (_, variables, context) => {
        // Invalidate the attempts list for the exam
        context?.queryClient.invalidateQueries({
          queryKey: examsQueryKeys.attempts.byExam(variables.examId),
        });
      }
    }
  );
}

/**
 * Hook for submitting an answer during an exam attempt
 * 
 * @returns TanStack Mutation hook for submitting answers
 */
export function useSubmitAnswerMutation() {
  return useApiMutation<ExamAnswer, SubmitAnswerPayload>(
    ({ attemptId }) => `${ATTEMPT_ENDPOINTS.DETAIL(attemptId)}/answer`,
    {
      method: 'POST',
      onSuccess: (_, variables, context) => {
        // Invalidate the specific attempt to update the answers
        context?.queryClient.invalidateQueries({
          queryKey: examsQueryKeys.attempts.detail(variables.attemptId as any),
        });
      }
    }
  );
}

/**
 * Hook for submitting a completed exam attempt
 * 
 * @returns TanStack Mutation hook for submitting attempts
 */
export function useSubmitAttemptMutation() {
  return useApiMutation<ExamResult, SubmitAttemptPayload>(
    ({ attemptId }) => ATTEMPT_ENDPOINTS.SUBMIT(attemptId),
    {
      method: 'POST',
      onSuccess: (_, variables, context) => {
        // Invalidate both the attempt and the result
        context?.queryClient.invalidateQueries({
          queryKey: examsQueryKeys.attempts.detail(variables.attemptId as any),
        });
        
        context?.queryClient.invalidateQueries({
          queryKey: examsQueryKeys.attempts.result(variables.attemptId as any),
        });
      }
    }
  );
}

/**
 * Hook for abandoning an in-progress exam attempt
 * 
 * @returns TanStack Mutation hook for abandoning attempts
 */
export function useAbandonAttemptMutation() {
  return useApiMutation<void, { attemptId: string }>(
    ({ attemptId }) => `${ATTEMPT_ENDPOINTS.DETAIL(attemptId)}/abandon`,
    {
      method: 'POST',
      onSuccess: (_, variables, context) => {
        // Invalidate the attempt
        context?.queryClient.invalidateQueries({
          queryKey: examsQueryKeys.attempts.detail(variables.attemptId as any),
        });
      }
    }
  );
}
