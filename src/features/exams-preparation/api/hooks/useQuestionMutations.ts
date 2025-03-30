/**
 * Question Mutations Hooks
 * 
 * This module provides hooks for adding, updating, and deleting questions.
 * It leverages the core API module for data mutations and query invalidation.
 */
import { useApiMutation } from '@/core/api/hooks/mutation/useApiMutation';
import { QUESTION_ENDPOINTS } from '../constants/endpoints';
import { examsQueryKeys } from '../utils/queryKeys';
import { Question, QuestionType, DifficultyLevel } from '../../types';

/**
 * Interface for question creation payload
 */
export interface CreateQuestionPayload {
  examId: number;
  text: string;
  type: QuestionType;
  options?: Array<{
    id: string;
    text: string;
    isCorrect?: boolean;
  }>;
  correctAnswers?: string[];
  pointValue: number;
  explanation?: string;
  difficulty?: DifficultyLevel;
  orderIndex?: number;
}

/**
 * Interface for question update payload
 */
export interface UpdateQuestionPayload {
  text?: string;
  type?: QuestionType;
  options?: Array<{
    id: string;
    text: string;
    isCorrect?: boolean;
  }>;
  correctAnswers?: string[];
  pointValue?: number;
  explanation?: string;
  difficulty?: DifficultyLevel;
  orderIndex?: number;
}

/**
 * Hook for adding a question to an exam
 * 
 * @returns TanStack Mutation hook for adding questions
 */
export function useAddQuestionMutation() {
  return useApiMutation<Question, CreateQuestionPayload>(
    ({ examId }) => QUESTION_ENDPOINTS.CREATE(examId),
    {
      onSuccess: (_, variables, context) => {
        // Invalidate the questions list for the exam
        context?.queryClient.invalidateQueries({
          queryKey: examsQueryKeys.questions(variables.examId),
        });
        
        // Also invalidate the exam detail as the question count changes
        context?.queryClient.invalidateQueries({
          queryKey: examsQueryKeys.detail(variables.examId),
        });
      }
    }
  );
}

/**
 * Hook for updating a question
 * 
 * @returns TanStack Mutation hook for updating questions
 */
export function useUpdateQuestionMutation() {
  return useApiMutation<
    Question, 
    { examId: number; questionId: number; data: UpdateQuestionPayload }
  >(
    ({ examId, questionId }) => QUESTION_ENDPOINTS.UPDATE(examId, questionId),
    {
      method: 'PUT',
      onSuccess: (_, variables, context) => {
        // Invalidate the questions list for the exam
        context?.queryClient.invalidateQueries({
          queryKey: examsQueryKeys.questions(variables.examId),
        });
        
        // Also invalidate the specific question
        context?.queryClient.invalidateQueries({
          queryKey: [
            ...examsQueryKeys.questions(variables.examId),
            variables.questionId
          ],
        });
      }
    }
  );
}

/**
 * Hook for deleting a question
 * 
 * @returns TanStack Mutation hook for deleting questions
 */
export function useDeleteQuestionMutation() {
  return useApiMutation<
    void, 
    { examId: number; questionId: number }
  >(
    ({ examId, questionId }) => QUESTION_ENDPOINTS.DELETE(examId, questionId),
    {
      method: 'DELETE',
      onSuccess: (_, variables, context) => {
        // Invalidate the questions list for the exam
        context?.queryClient.invalidateQueries({
          queryKey: examsQueryKeys.questions(variables.examId),
        });
        
        // Also invalidate the exam detail as the question count changes
        context?.queryClient.invalidateQueries({
          queryKey: examsQueryKeys.detail(variables.examId),
        });
      }
    }
  );
}

/**
 * Hook for reordering questions
 * 
 * @returns TanStack Mutation hook for reordering questions
 */
export function useReorderQuestionsMutation() {
  return useApiMutation<
    void, 
    { examId: number; orderUpdates: Array<{ questionId: number; orderIndex: number }> }
  >(
    ({ examId }) => `${QUESTION_ENDPOINTS.LIST(examId)}/reorder`,
    {
      method: 'PATCH',
      onSuccess: (_, variables, context) => {
        // Invalidate the questions list for the exam
        context?.queryClient.invalidateQueries({
          queryKey: examsQueryKeys.questions(variables.examId),
        });
      }
    }
  );
}
