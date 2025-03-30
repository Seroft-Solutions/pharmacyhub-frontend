/**
 * Exam Attempt Query Hooks
 * 
 * This module provides hooks for fetching and manipulating exam attempts
 * using the core API module.
 */
import { useApiQuery, useApiMutation } from '@/core/api/hooks';
import { Attempt, Answer } from '../../types';
import { examsQueryKeys, attemptKeys } from '../utils/queryKeys';
import { API_ENDPOINTS } from '../constants';

/**
 * Hook for fetching a specific exam attempt
 */
export const useExamAttempt = (attemptId: number, options = {}) => {
  return useApiQuery<Attempt>(
    attemptKeys.detail(attemptId),
    API_ENDPOINTS.ATTEMPT(attemptId),
    options
  );
};

/**
 * Hook for fetching all attempts for a specific exam
 */
export const useExamAttempts = (examId: number, options = {}) => {
  return useApiQuery<Attempt[]>(
    attemptKeys.byExam(examId),
    API_ENDPOINTS.EXAM_ATTEMPTS(examId),
    options
  );
};

/**
 * Hook for starting a new exam attempt
 */
export const useStartExam = () => {
  return useApiMutation<Attempt, number>(
    (examId) => API_ENDPOINTS.START_EXAM(examId),
    {
      onSuccess: (data, examId, context) => {
        // Invalidate exam attempts list
        context?.queryClient?.invalidateQueries({
          queryKey: attemptKeys.byExam(typeof examId === 'number' ? examId : 0)
        });
      }
    }
  );
};

/**
 * Hook for submitting an exam attempt
 */
export const useSubmitExam = () => {
  return useApiMutation<Attempt, number>(
    (attemptId) => API_ENDPOINTS.SUBMIT_EXAM(attemptId),
    {
      onSuccess: (data, attemptId, context) => {
        // Invalidate the specific attempt
        context?.queryClient?.invalidateQueries({
          queryKey: attemptKeys.detail(typeof attemptId === 'number' ? attemptId : 0)
        });
        
        // Invalidate attempt result as well
        context?.queryClient?.invalidateQueries({
          queryKey: attemptKeys.result(typeof attemptId === 'number' ? attemptId : 0)
        });
      }
    }
  );
};

/**
 * Hook for saving an answer to a question
 */
export const useSaveAnswer = () => {
  return useApiMutation<
    Answer,
    { attemptId: number; questionId: number; answer: string }
  >(
    ({ attemptId, questionId }) => API_ENDPOINTS.SAVE_ANSWER(attemptId, questionId),
    {
      onSuccess: (data, variables, context) => {
        // Invalidate the specific attempt
        context?.queryClient?.invalidateQueries({
          queryKey: attemptKeys.detail(variables.attemptId)
        });
      }
    }
  );
};

/**
 * Hook for flagging a question
 */
export const useFlagQuestion = () => {
  return useApiMutation<
    void,
    { attemptId: number; questionId: number; flagged: boolean }
  >(
    ({ attemptId, questionId }) => API_ENDPOINTS.FLAG_QUESTION(attemptId, questionId),
    {
      onSuccess: (_, variables, context) => {
        // Invalidate the specific attempt
        context?.queryClient?.invalidateQueries({
          queryKey: attemptKeys.detail(variables.attemptId)
        });
      }
    }
  );
};
