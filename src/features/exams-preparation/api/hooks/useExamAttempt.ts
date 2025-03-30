/**
 * Exam Attempt Hooks
 * 
 * This module provides hooks for managing exam attempts.
 */

import { createQueryHook, createMutationHook } from './hookFactory';
import { examService } from '../services';
import { ExamAttempt, ExamAnswer } from '../../types/models/exam';
import { API_ENDPOINTS } from '../constants';
import { apiClient } from '@/core/api';

/**
 * Hook for fetching an exam attempt by ID
 */
export const useExamAttempt = createQueryHook<ExamAttempt, string>(
  'examAttempt',
  async (attemptId) => {
    return examService.getAttemptById(attemptId);
  }
);

/**
 * Hook for starting a new exam attempt
 */
export const useStartExamAttempt = createMutationHook<
  ExamAttempt,
  number
>(
  async (examId) => {
    const { data } = await apiClient.post(API_ENDPOINTS.START_ATTEMPT(examId));
    return data;
  }
);

/**
 * Hook for answering a question in an exam attempt
 */
export const useAnswerQuestion = createMutationHook<
  void,
  { attemptId: string; questionId: number; answer: string | string[] }
>(
  async ({ attemptId, questionId, answer }) => {
    const payload = {
      selectedOptions: Array.isArray(answer) ? answer : [answer],
    };
    
    await apiClient.post(
      API_ENDPOINTS.ANSWER_QUESTION(attemptId, questionId),
      payload
    );
  }
);

/**
 * Hook for flagging/unflagging a question
 */
export const useFlagQuestion = createMutationHook<
  void,
  { attemptId: string; questionId: number; flagged: boolean }
>(
  async ({ attemptId, questionId, flagged }) => {
    if (flagged) {
      await apiClient.post(API_ENDPOINTS.FLAG_QUESTION(attemptId, questionId));
    } else {
      await apiClient.delete(API_ENDPOINTS.FLAG_QUESTION(attemptId, questionId));
    }
  }
);

/**
 * Hook for completing an exam attempt
 */
export const useCompleteAttempt = createMutationHook<
  void,
  string
>(
  async (attemptId) => {
    await apiClient.post(API_ENDPOINTS.SUBMIT_ATTEMPT(attemptId));
  }
);

/**
 * Hook for fetching all active attempts for the current user
 */
export const useActiveAttempts = createQueryHook<ExamAttempt[], void>(
  'activeAttempts',
  async () => {
    return examService.getActiveAttempts();
  }
);
