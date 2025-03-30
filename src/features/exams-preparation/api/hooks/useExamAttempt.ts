/**
 * Exam Attempt Query Hooks
 * 
 * This module provides hooks for fetching and manipulating exam attempts
 * using the core API hooks factory.
 */
import { attemptsApiHooks } from '../services/apiHooksFactory';
import { Attempt, Answer } from '../../types';

/**
 * Hook for fetching a specific exam attempt
 */
export const useExamAttempt = (attemptId: number, options = {}) => {
  return attemptsApiHooks.useDetail<Attempt>(attemptId, options);
};

/**
 * Hook for fetching all attempts for a specific exam
 */
export const useExamAttempts = (examId: number, options = {}) => {
  return attemptsApiHooks.useCustomQuery<Attempt[]>(
    'byExam',
    ['byExam', examId],
    {
      urlParams: { examId },
      ...options
    }
  );
};

/**
 * Hook for starting a new exam attempt
 */
export const useStartExam = () => {
  return attemptsApiHooks.useAction<Attempt, number>(
    (examId) => examsApiHooks.queryKeys.custom('startExam', examId),
    {
      onSuccess: (data, examId, context) => {
        // Invalidate exam attempts list
        context?.queryClient.invalidateQueries({
          queryKey: attemptsApiHooks.queryKeys.custom('byExam', examId)
        });
      }
    }
  );
};

/**
 * Hook for submitting an exam attempt
 */
export const useSubmitExam = () => {
  return attemptsApiHooks.useAction<Attempt, number>(
    (attemptId) => attemptsApiHooks.queryKeys.custom('submit', attemptId),
    {
      onSuccess: (data, attemptId, context) => {
        // Invalidate the specific attempt
        context?.queryClient.invalidateQueries({
          queryKey: attemptsApiHooks.queryKeys.detail(attemptId)
        });
        
        // Invalidate attempt result as well
        context?.queryClient.invalidateQueries({
          queryKey: attemptsApiHooks.queryKeys.custom('result', attemptId)
        });
      }
    }
  );
};

/**
 * Hook for saving an answer to a question
 */
export const useSaveAnswer = () => {
  return attemptsApiHooks.useAction<
    Answer,
    { attemptId: number; questionId: number; answer: string }
  >(
    ({ attemptId, questionId }) => attemptsApiHooks.queryKeys.custom('saveAnswer', { attemptId, questionId }),
    {
      onSuccess: (data, variables, context) => {
        // Invalidate the specific attempt
        context?.queryClient.invalidateQueries({
          queryKey: attemptsApiHooks.queryKeys.detail(variables.attemptId)
        });
      }
    }
  );
};

/**
 * Hook for flagging a question
 */
export const useFlagQuestion = () => {
  return attemptsApiHooks.useAction<
    void,
    { attemptId: number; questionId: number; flagged: boolean }
  >(
    ({ attemptId, questionId }) => attemptsApiHooks.queryKeys.custom('flagQuestion', { attemptId, questionId }),
    {
      method: ({ flagged }) => flagged ? 'POST' : 'DELETE',
      onSuccess: (_, variables, context) => {
        // Invalidate the specific attempt
        context?.queryClient.invalidateQueries({
          queryKey: attemptsApiHooks.queryKeys.detail(variables.attemptId)
        });
      }
    }
  );
};
