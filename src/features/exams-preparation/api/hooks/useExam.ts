/**
 * Single Exam Query Hook
 * 
 * This module provides hooks for fetching and manipulating a single exam.
 */

import { createQueryHook, createMutationHook } from './hookFactory';
import { examService } from '../services';
import { Exam, Question } from '../../types/models/exam';
import { API_ENDPOINTS } from '../constants';
import { apiClient } from '@/core/api';

/**
 * Hook for fetching a single exam by ID
 */
export const useExam = createQueryHook<Exam, number>(
  'exam',
  async (examId) => {
    return examService.getExamById(examId);
  },
  {
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 15 * 60 * 1000, // 15 minutes
  }
);

/**
 * Hook for fetching questions for a specific exam
 */
export const useExamQuestions = createQueryHook<Question[], number>(
  'examQuestions',
  async (examId) => {
    return examService.getExamQuestions(examId);
  }
);

/**
 * Hook for adding a question to an exam
 */
export const useAddQuestion = createMutationHook<
  Question,
  { examId: number; question: Omit<Question, 'id'> }
>(
  async ({ examId, question }) => {
    const { data } = await apiClient.post(API_ENDPOINTS.QUESTIONS(examId), question);
    return data;
  }
);

/**
 * Hook for updating a question
 */
export const useUpdateQuestion = createMutationHook<
  Question,
  { examId: number; questionId: number; question: Partial<Question> }
>(
  async ({ examId, questionId, question }) => {
    const { data } = await apiClient.put(
      API_ENDPOINTS.QUESTION_BY_ID(examId, questionId),
      question
    );
    return data;
  }
);

/**
 * Hook for deleting a question
 */
export const useDeleteQuestion = createMutationHook<
  void,
  { examId: number; questionId: number }
>(
  async ({ examId, questionId }) => {
    await apiClient.delete(API_ENDPOINTS.QUESTION_BY_ID(examId, questionId));
  }
);
