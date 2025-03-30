'use client';

/**
 * Exam Attempt Hooks
 *
 * This module provides React hooks for interacting with exam attempt-related APIs.
 * It leverages the createApiHooks factory from core api module.
 */
import { createApiHooks } from '@/core/api/factories/createApiHooks';
import { useQueryClient } from '@tanstack/react-query';
import { ATTEMPT_ENDPOINTS, EXAM_ENDPOINTS } from '../constants';
import { examQueryKeys } from './useExamApiHooks';
import type {
  ExamAttempt, 
  ExamResult, 
  FlaggedQuestion, 
  UserAnswer
} from '../../types';

/**
 * Create standard CRUD hooks for attempts
 */
export const attemptApiHooks = createApiHooks<ExamAttempt>(
  ATTEMPT_ENDPOINTS,
  {
    resourceName: 'attempts',
    requiresAuth: true,
    defaultStaleTime: 1 * 60 * 1000 // 1 minute (shorter for active exams)
  }
);

/**
 * Extended attempt query keys
 */
export const attemptQueryKeys = {
  ...attemptApiHooks.queryKeys,
  userAttempts: () => [...attemptApiHooks.queryKeys.all(), 'user'] as const,
  userAttemptsForExam: (examId: number) => [...attemptApiHooks.queryKeys.all(), 'exam', examId] as const,
  result: (attemptId: number) => [...attemptApiHooks.queryKeys.detail(attemptId), 'result'] as const,
  flags: (attemptId: number) => [...attemptApiHooks.queryKeys.detail(attemptId), 'flags'] as const,
};

/**
 * Hook for fetching a user's exam attempts
 */
export const useUserExamAttempts = () => {
  return attemptApiHooks.useList<ExamAttempt[]>();
};

/**
 * Hook for fetching a user's exam attempts for a specific exam
 */
export const useUserExamAttemptsForExam = (examId: number) => {
  return attemptApiHooks.useCustomQuery<ExamAttempt[]>(
    'byExam',
    ['exam', examId],
    {
      enabled: !!examId,
      staleTime: 1 * 60 * 1000, // 1 minute
      urlParams: {
        id: examId ? String(parseInt(examId.toString())) : '0'
      }
    }
  );
};

/**
 * Hook for fetching a specific exam attempt
 */
export const useExamAttempt = (attemptId: number) => {
  return attemptApiHooks.useDetail<ExamAttempt>(
    attemptId,
    {
      enabled: !!attemptId,
      staleTime: 1 * 60 * 1000, // 1 minute
    }
  );
};

/**
 * Hook for fetching exam results
 */
export const useExamResult = (attemptId: number) => {
  return attemptApiHooks.useCustomQuery<ExamResult>(
    'result',
    ['result', attemptId],
    {
      enabled: !!attemptId,
      staleTime: 0, // Always get fresh results
      urlParams: {
        id: attemptId ? String(parseInt(attemptId.toString())) : '0'
      }
    }
  );
};

/**
 * Hook for fetching flagged questions for an attempt
 */
export const useFlaggedQuestions = (attemptId: number) => {
  return attemptApiHooks.useCustomQuery<FlaggedQuestion[]>(
    'flags',
    ['flags', attemptId],
    {
      enabled: !!attemptId,
      staleTime: 0, // Always get fresh flags
      urlParams: {
        id: attemptId ? String(parseInt(attemptId.toString())) : '0'
      }
    }
  );
};

/**
 * Hook for starting an exam
 */
export const useStartExamMutation = (examId: number) => {
  const queryClient = useQueryClient();
  // Ensure proper ID conversion for Java
  const safeExamId = examId ? String(parseInt(examId.toString())) : '0';
  const endpoint = ATTEMPT_ENDPOINTS.start ? 
    ATTEMPT_ENDPOINTS.start.replace(':id', safeExamId) : 
    EXAM_ENDPOINTS.startExam.replace(':id', safeExamId);

  return attemptApiHooks.useAction<ExamAttempt, { userId?: string }>(
    endpoint,
    {
      onSuccess: (data) => {
        // Invalidate relevant queries
        queryClient.invalidateQueries(examQueryKeys.detail(examId));
        queryClient.invalidateQueries(attemptQueryKeys.userAttemptsForExam(examId));
        queryClient.invalidateQueries(attemptQueryKeys.userAttempts());
      }
    }
  );
};

/**
 * Hook for answering a question
 */
export const useAnswerQuestionMutation = (attemptId: number, questionId: number) => {
  // Ensure proper ID conversion for Java
  const safeAttemptId = attemptId ? String(parseInt(attemptId.toString())) : '0';
  const safeQuestionId = questionId ? String(parseInt(questionId.toString())) : '0';
  const endpoint = ATTEMPT_ENDPOINTS.answer
    .replace(':attemptId', safeAttemptId)
    .replace(':questionId', safeQuestionId);

  return attemptApiHooks.useAction<void, { 
    questionId: number, 
    selectedOptionId: string, // Use string type for selectedOptionId
    timeSpent: number 
  }>(
    endpoint
  );
};

/**
 * Hook for flagging a question
 */
export const useFlagQuestionMutation = (attemptId: number, questionId: number) => {
  const queryClient = useQueryClient();
  // Ensure proper ID conversion for Java
  const safeAttemptId = attemptId ? String(parseInt(attemptId.toString())) : '0';
  const safeQuestionId = questionId ? String(parseInt(questionId.toString())) : '0';
  const endpoint = ATTEMPT_ENDPOINTS.flag
    .replace(':attemptId', safeAttemptId)
    .replace(':questionId', safeQuestionId);

  return attemptApiHooks.useAction<void, void>(
    endpoint,
    {
      onSuccess: () => {
        // Invalidate flagged questions query
        queryClient.invalidateQueries(attemptQueryKeys.flags(attemptId));
      }
    }
  );
};

/**
 * Hook for unflagging a question
 */
export const useUnflagQuestionMutation = (attemptId: number, questionId: number) => {
  const queryClient = useQueryClient();
  // Ensure proper ID conversion for Java
  const safeAttemptId = attemptId ? String(parseInt(attemptId.toString())) : '0';
  const safeQuestionId = questionId ? String(parseInt(questionId.toString())) : '0';
  const endpoint = ATTEMPT_ENDPOINTS.unflag
    .replace(':attemptId', safeAttemptId)
    .replace(':questionId', safeQuestionId);

  return attemptApiHooks.useAction<void, void>(
    endpoint,
    {
      method: 'DELETE',
      onSuccess: () => {
        // Invalidate flagged questions query
        queryClient.invalidateQueries(attemptQueryKeys.flags(attemptId));
      }
    }
  );
};

/**
 * Hook for submitting an exam
 */
export const useSubmitExamMutation = (attemptId: number) => {
  const queryClient = useQueryClient();
  // Ensure proper ID conversion for Java
  const safeAttemptId = attemptId ? String(parseInt(attemptId.toString())) : '0';
  const endpoint = ATTEMPT_ENDPOINTS.submit.replace(':id', safeAttemptId);

  return attemptApiHooks.useAction<ExamResult, { answers?: UserAnswer[] }>(
    endpoint,
    {
      onSuccess: (data) => {
        // Invalidate relevant queries
        queryClient.invalidateQueries(attemptQueryKeys.detail(attemptId));
        queryClient.invalidateQueries(attemptQueryKeys.result(attemptId));
        queryClient.invalidateQueries(attemptQueryKeys.userAttempts());
      }
    }
  );
};

// Export standard CRUD hooks with more descriptive names
export const {
  useList: useAttemptsList,
  useDetail: useAttemptDetail,
} = attemptApiHooks;

// Export everything as a combined object for convenience
export const attemptHooks = {
  // Standard CRUD hooks
  useAttemptsList,
  useAttemptDetail,

  // Specialized attempt hooks
  useUserExamAttempts,
  useUserExamAttemptsForExam,
  useExamAttempt,
  useExamResult,
  useFlaggedQuestions,

  // Mutation hooks
  useStartExamMutation,
  useAnswerQuestionMutation,
  useFlagQuestionMutation,
  useUnflagQuestionMutation,
  useSubmitExamMutation,

  // Query keys
  queryKeys: attemptQueryKeys,
};

export default attemptHooks;