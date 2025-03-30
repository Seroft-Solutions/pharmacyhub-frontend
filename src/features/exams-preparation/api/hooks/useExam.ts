/**
 * Single Exam Query Hook
 * 
 * This module provides hooks for fetching and manipulating a single exam
 * using the core API hooks factory.
 */
import { examsApiHooks } from '../services/apiHooksFactory';
import { Exam, Question } from '../../types/models/exam';

/**
 * Hook for fetching a single exam by ID
 */
export const useExam = (examId: number, options = {}) => {
  return examsApiHooks.useDetail<Exam>(examId, options);
};

/**
 * Hook for fetching questions for a specific exam
 */
export const useExamQuestions = (examId: number, options = {}) => {
  return examsApiHooks.useCustomQuery<Question[]>(
    'questions',
    ['questions', { examId }],
    {
      urlParams: { examId },
      ...options
    }
  );
};

/**
 * Hook for adding a question to an exam
 */
export const useAddQuestion = () => {
  return examsApiHooks.useAction<
    Question,
    { examId: number; question: Omit<Question, 'id'> }
  >(
    ({ examId }) => examsApiHooks.queryKeys.custom('questions', { examId }),
    {
      onSuccess: (_, variables, context) => {
        // Invalidate relevant queries on success
        context?.queryClient.invalidateQueries({
          queryKey: examsApiHooks.queryKeys.custom('questions', { examId: variables.examId })
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
    ({ examId, questionId }) => examsApiHooks.queryKeys.custom('question', { examId, questionId }),
    {
      method: 'PUT',
      onSuccess: (_, variables, context) => {
        // Invalidate relevant queries on success
        context?.queryClient.invalidateQueries({
          queryKey: examsApiHooks.queryKeys.custom('questions', { examId: variables.examId })
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
    ({ examId, questionId }) => examsApiHooks.queryKeys.custom('question', { examId, questionId }),
    {
      method: 'DELETE',
      onSuccess: (_, variables, context) => {
        // Invalidate relevant queries on success
        context?.queryClient.invalidateQueries({
          queryKey: examsApiHooks.queryKeys.custom('questions', { examId: variables.examId })
        });
      }
    }
  );
};
