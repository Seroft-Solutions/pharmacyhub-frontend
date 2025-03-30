/**
 * Single Exam Query Hook
 * 
 * This module provides hooks for fetching and manipulating a single exam
 * using the core API module with proper error handling.
 */
import { useApiQuery, useApiMutation } from '@/core/api/hooks';
import { Exam, Question } from '../../types/models/exam';
import { examsQueryKeys } from '../utils/queryKeys';
import { ENDPOINTS } from '../constants';
import { handleExamError } from '../utils/errorHandler';

/**
 * Hook for fetching a single exam by ID
 */
export const useExam = (examId: number, options = {}) => {
  return useApiQuery<Exam>(
    examsQueryKeys.detail(examId),
    ENDPOINTS.DETAIL(examId),
    {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 15 * 60 * 1000, // 15 minutes
      onError: (error) => {
        // Use core error handling with exam-specific context
        handleExamError(error, { 
          examId,
          action: 'fetch-exam',
          endpoint: ENDPOINTS.DETAIL(examId)
        });
      },
      ...options
    }
  );
};

/**
 * Hook for fetching questions for a specific exam
 */
export const useExamQuestions = (examId: number, options = {}) => {
  return useApiQuery<Question[]>(
    examsQueryKeys.questions(examId),
    ENDPOINTS.QUESTIONS(examId),
    {
      onError: (error) => {
        // Use core error handling with exam-specific context
        handleExamError(error, { 
          examId,
          action: 'fetch-questions',
          endpoint: ENDPOINTS.QUESTIONS(examId)
        });
      },
      ...options
    }
  );
};

/**
 * Hook for adding a question to an exam
 */
export const useAddQuestion = () => {
  return useApiMutation<
    Question,
    { examId: number; question: Omit<Question, 'id'> }
  >(
    ({ examId }) => ENDPOINTS.QUESTIONS(examId),
    {
      onSuccess: (_, variables, context) => {
        // Invalidate relevant queries on success
        context?.queryClient?.invalidateQueries({
          queryKey: examsQueryKeys.questions(variables.examId)
        });
      },
      onError: (error, variables) => {
        // Use core error handling with exam-specific context
        handleExamError(error, { 
          examId: variables.examId,
          action: 'add-question',
          endpoint: ENDPOINTS.QUESTIONS(variables.examId)
        });
      }
    }
  );
};

/**
 * Hook for updating a question
 */
export const useUpdateQuestion = () => {
  return useApiMutation<
    Question,
    { examId: number; questionId: number; question: Partial<Question> }
  >(
    ({ examId, questionId }) => ENDPOINTS.QUESTION_BY_ID(examId, questionId),
    {
      method: 'PUT',
      onSuccess: (_, variables, context) => {
        // Invalidate relevant queries on success
        context?.queryClient?.invalidateQueries({
          queryKey: examsQueryKeys.questions(variables.examId)
        });
      },
      onError: (error, variables) => {
        // Use core error handling with exam-specific context
        handleExamError(error, { 
          examId: variables.examId,
          questionId: variables.questionId,
          action: 'update-question',
          endpoint: ENDPOINTS.QUESTION_BY_ID(
            variables.examId, 
            variables.questionId
          )
        });
      }
    }
  );
};

/**
 * Hook for deleting a question
 */
export const useDeleteQuestion = () => {
  return useApiMutation<
    void,
    { examId: number; questionId: number }
  >(
    ({ examId, questionId }) => ENDPOINTS.QUESTION_BY_ID(examId, questionId),
    {
      method: 'DELETE',
      onSuccess: (_, variables, context) => {
        // Invalidate relevant queries on success
        context?.queryClient?.invalidateQueries({
          queryKey: examsQueryKeys.questions(variables.examId)
        });
      },
      onError: (error, variables) => {
        // Use core error handling with exam-specific context
        handleExamError(error, { 
          examId: variables.examId,
          questionId: variables.questionId,
          action: 'delete-question',
          endpoint: ENDPOINTS.QUESTION_BY_ID(
            variables.examId, 
            variables.questionId
          )
        });
      }
    }
  );
};
