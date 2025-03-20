/**
 * Exam API Hooks
 *
 * This module provides React hooks for interacting with exam-related APIs.
 * It leverages the createApiHooks factory from tanstack-query-api.
 */
import { createApiHooks } from '@/features/core/tanstack-query-api/factories/createApiHooks';
import { useQueryClient } from '@tanstack/react-query';
import { EXAM_ENDPOINTS } from '../constants';
import type {
  Exam,
  ExamStatus,
  Question,
  ExamStats,
} from '../../types';

/**
 * Create standard CRUD hooks for exams
 */
export const examApiHooks = createApiHooks<Exam>(
  EXAM_ENDPOINTS,
  {
    resourceName: 'exams',
    requiresAuth: true,
    defaultStaleTime: 5 * 60 * 1000 // 5 minutes
  }
);

/**
 * Extended exam query keys
 */
export const examQueryKeys = {
  ...examApiHooks.queryKeys,
  published: () => [...examApiHooks.queryKeys.all(), 'published'] as const,
  byStatus: (status: ExamStatus) => 
    [...examApiHooks.queryKeys.all(), 'status', status.toString()] as const,
  questions: (examId: number) => 
    [...examApiHooks.queryKeys.detail(examId), 'questions'] as const,
  stats: () => [...examApiHooks.queryKeys.all(), 'stats'] as const,
};

/**
 * Custom hooks built on top of the standard hooks
 */

/**
 * Hook for fetching published exams
 */
export const usePublishedExams = () => {
  return examApiHooks.useCustomQuery<Exam[]>(
    'published',
    'published',
    {
      requiresAuth: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    }
  );
};

/**
 * Hook for fetching exams by status
 */
export const useExamsByStatus = (status: ExamStatus) => {
  return examApiHooks.useCustomQuery<Exam[]>(
    'byStatus',
    ['status', status],
    {
      enabled: !!status,
      staleTime: 5 * 60 * 1000, // 5 minutes
      urlParams: {
        status: status.toString()
      }
    }
  );
};

/**
 * Hook for fetching exam questions
 */
export const useExamQuestions = (examId: number) => {
  return examApiHooks.useCustomQuery<Question[]>(
    'questions',
    ['questions', examId],
    {
      enabled: !!examId,
      staleTime: 5 * 60 * 1000, // 5 minutes
      urlParams: {
        examId: examId // Will be properly converted to Long format by the hook
      }
    }
  );
};

/**
 * Hook for fetching exam statistics
 */
export const useExamStats = () => {
  return examApiHooks.useCustomQuery<ExamStats>(
    'examStats',
    'stats',
    {
      staleTime: 5 * 60 * 1000, // 5 minutes
    }
  );
};

/**
 * Hook for publishing an exam
 */
export const usePublishExamMutation = (examId: number) => {
  const queryClient = useQueryClient();
  const endpoint = EXAM_ENDPOINTS.publishExam.replace(':id', examId.toString());

  return examApiHooks.useAction<Exam, void>(
    endpoint,
    {
      onSuccess: (data) => {
        // Invalidate relevant queries
        queryClient.invalidateQueries(examQueryKeys.detail(examId));
        queryClient.invalidateQueries(examQueryKeys.lists());
        queryClient.invalidateQueries(examQueryKeys.published());
      }
    }
  );
};

/**
 * Hook for archiving an exam
 */
export const useArchiveExamMutation = (examId: number) => {
  const queryClient = useQueryClient();
  const endpoint = EXAM_ENDPOINTS.archiveExam.replace(':id', examId.toString());

  return examApiHooks.useAction<Exam, void>(
    endpoint,
    {
      onSuccess: (data) => {
        // Invalidate relevant queries
        queryClient.invalidateQueries(examQueryKeys.detail(examId));
        queryClient.invalidateQueries(examQueryKeys.lists());
        queryClient.invalidateQueries(examQueryKeys.published());
      }
    }
  );
};

/**
 * Hook for updating a question in an exam
 */
export const useUpdateQuestionMutation = (examId: number, questionId: number) => {
  const queryClient = useQueryClient();
  const endpoint = EXAM_ENDPOINTS.updateQuestion
    .replace(':examId', examId.toString())
    .replace(':questionId', questionId.toString());

  return examApiHooks.useAction<Question, Partial<Question>>(
    endpoint,
    {
      method: 'PUT',
      onSuccess: (data) => {
        // Invalidate relevant queries
        queryClient.invalidateQueries(examQueryKeys.questions(examId));
      }
    }
  );
};

/**
 * Hook for deleting a question from an exam
 */
export const useDeleteQuestionMutation = (examId: number, questionId: number) => {
  const queryClient = useQueryClient();
  const endpoint = EXAM_ENDPOINTS.deleteQuestion
    .replace(':examId', examId.toString())
    .replace(':questionId', questionId.toString());

  return examApiHooks.useAction<void, void>(
    endpoint,
    {
      method: 'DELETE',
      onSuccess: () => {
        // Invalidate relevant queries
        queryClient.invalidateQueries(examQueryKeys.questions(examId));
        queryClient.invalidateQueries(examQueryKeys.detail(examId));
      }
    }
  );
};

// Export standard CRUD hooks with more descriptive names
export const {
  useList: useExamsList,
  useDetail: useExamDetail,
  useCreate: useCreateExam,
  useUpdate: useUpdateExam,
  usePatch: usePatchExam,
  useDelete: useDeleteExam,
} = examApiHooks;

// Export everything as a combined object for convenience
export const examHooks = {
  // Standard CRUD hooks
  useExamsList,
  useExamDetail,
  useCreateExam,
  useUpdateExam,
  usePatchExam,
  useDeleteExam,

  // Specialized exam hooks
  usePublishedExams,
  useExamsByStatus,
  useExamQuestions,
  useExamStats,

  // Action hooks
  usePublishExamMutation,
  useArchiveExamMutation,
  useUpdateQuestionMutation,
  useDeleteQuestionMutation,

  // Query keys
  queryKeys: examQueryKeys,
};

export default examHooks;
