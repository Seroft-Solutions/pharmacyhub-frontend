/**
 * Exam API Hooks
 *
 * This module provides React hooks for interacting with exam-related APIs.
 * It leverages the createApiHooks factory for consistent patterns.
 */
import {useQueryClient} from '@tanstack/react-query';
import {createApiHooks, useApiMutation, useApiQuery} from '@/features/tanstack-query-api';
import {EXAM_ENDPOINTS as examEndpoints} from '../constants';
import type {
  Exam,
  ExamAttempt,
  ExamPaper,
  ExamResult,
  ExamStats,
  ExamStatus,
  FlaggedQuestion,
  Question,
  UserAnswer
} from '../../types/StandardTypes';

// Create standard CRUD hooks for exams
export const examApiHooks = createApiHooks<Exam>(
  examEndpoints,
  {
    resourceName: 'exams',
    requiresAuth: true,
    defaultStaleTime: 5 * 60 * 1000 // 5 minutes
  }
);

// Create query keys for papers
const paperQueryKeys = {
  ...examApiHooks.queryKeys,
  papers: () => [...examApiHooks.queryKeys.all(), 'papers'] as const,
  paperList: () => [...paperQueryKeys.papers(), 'list'] as const,
  paperDetail: (id: number) => [...paperQueryKeys.papers(), 'detail', id] as const,
  model: () => [...paperQueryKeys.papers(), 'model'] as const,
  past: () => [...paperQueryKeys.papers(), 'past'] as const,
  subject: () => [...paperQueryKeys.papers(), 'subject'] as const,
  practice: () => [...paperQueryKeys.papers(), 'practice'] as const,
  stats: () => [...examApiHooks.queryKeys.all(), 'stats'] as const,
};

// Create query keys for attempts
const attemptQueryKeys = {
  ...examApiHooks.queryKeys,
  attempts: () => [...examApiHooks.queryKeys.all(), 'attempts'] as const,
  userAttempts: () => [...attemptQueryKeys.attempts(), 'user'] as const,
  userAttemptsForExam: (examId: number) => [...attemptQueryKeys.attempts(), 'exam', examId] as const,
  attempt: (attemptId: number) => [...attemptQueryKeys.attempts(), attemptId] as const,
  result: (attemptId: number) => [...attemptQueryKeys.attempts(), attemptId, 'result'] as const,
  flags: (attemptId: number) => [...attemptQueryKeys.attempts(), attemptId, 'flags'] as const,
};

/**
 * Hook for fetching published exams
 */
export const usePublishedExams = () => {
  return useApiQuery<Exam[]>(
    [...examApiHooks.queryKeys.all(), 'published'],
    examEndpoints.published,
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
  const endpoint = examEndpoints.byStatus.replace(
    ':status',
    status.toString()
  );

  return useApiQuery<Exam[]>(
    [...examApiHooks.queryKeys.all(), 'status', status.toString()],
    endpoint,
    {
      enabled: !!status,
      staleTime: 5 * 60 * 1000, // 5 minutes
    }
  );
};

/**
 * Hook for fetching exam questions
 */
export const useExamQuestions = (examId: number) => {
  const endpoint = examEndpoints.questions.replace(
    ':id',
    examId.toString()
  );

  return useApiQuery<Question[]>(
    [...examApiHooks.queryKeys.detail(examId), 'questions'],
    endpoint,
    {
      enabled: !!examId,
      staleTime: 5 * 60 * 1000, // 5 minutes
    }
  );
};

// Paper queries

/**
 * Hook for fetching all papers
 */
export const useAllPapers = () => {
  return useApiQuery<ExamPaper[]>(
    paperQueryKeys.paperList(),
    examEndpoints.papers,
    {
      staleTime: 5 * 60 * 1000, // 5 minutes
    }
  );
};

/**
 * Hook for fetching model papers
 */
export const useModelPapers = () => {
  return useApiQuery<ExamPaper[]>(
    paperQueryKeys.model(),
    examEndpoints.modelPapers,
    {
      staleTime: 5 * 60 * 1000, // 5 minutes
    }
  );
};

/**
 * Hook for fetching past papers
 */
export const usePastPapers = () => {
  return useApiQuery<ExamPaper[]>(
    paperQueryKeys.past(),
    examEndpoints.pastPapers,
    {
      staleTime: 5 * 60 * 1000, // 5 minutes
    }
  );
};

/**
 * Hook for fetching subject papers
 */
export const useSubjectPapers = () => {
  return useApiQuery<ExamPaper[]>(
    paperQueryKeys.subject(),
    examEndpoints.subjectPapers,
    {
      staleTime: 5 * 60 * 1000, // 5 minutes
    }
  );
};

/**
 * Hook for fetching practice papers
 */
export const usePracticePapers = () => {
  return useApiQuery<ExamPaper[]>(
    paperQueryKeys.practice(),
    examEndpoints.practicePapers,
    {
      staleTime: 5 * 60 * 1000, // 5 minutes
    }
  );
};

/**
 * Hook for fetching a specific paper by ID
 */
export const usePaperById = (id: number) => {
  const endpoint = examEndpoints.paperDetail.replace(':id', id.toString());

  return useApiQuery<ExamPaper>(
    paperQueryKeys.paperDetail(id),
    endpoint,
    {
      enabled: !!id,
      staleTime: 5 * 60 * 1000, // 5 minutes
    }
  );
};

/**
 * Hook for fetching exam statistics
 */
export const useExamStats = () => {
  return useApiQuery<ExamStats>(
    paperQueryKeys.stats(),
    examEndpoints.examStats,
    {
      staleTime: 10 * 60 * 1000, // 10 minutes
    }
  );
};

// Attempt Queries

/**
 * Hook for fetching a user's exam attempts
 */
export const useUserExamAttempts = () => {
  return useApiQuery<ExamAttempt[]>(
    attemptQueryKeys.userAttempts(),
    examEndpoints.userAttempts,
    {
      staleTime: 5 * 60 * 1000, // 5 minutes
    }
  );
};

/**
 * Hook for fetching a user's exam attempts for a specific exam
 */
export const useUserExamAttemptsForExam = (examId: number) => {
  const endpoint = examEndpoints.attemptsByExam.replace(':id', examId.toString());

  return useApiQuery<ExamAttempt[]>(
    attemptQueryKeys.userAttemptsForExam(examId),
    endpoint,
    {
      enabled: !!examId,
      staleTime: 5 * 60 * 1000, // 5 minutes
    }
  );
};

/**
 * Hook for fetching a specific exam attempt
 */
export const useExamAttempt = (attemptId: number) => {
  const endpoint = examEndpoints.attemptDetail.replace(':id', attemptId.toString());

  return useApiQuery<ExamAttempt>(
    attemptQueryKeys.attempt(attemptId),
    endpoint,
    {
      enabled: !!attemptId,
      staleTime: 5 * 60 * 1000, // 5 minutes
    }
  );
};

/**
 * Hook for fetching exam results
 */
export const useExamResult = (attemptId: number) => {
  const endpoint = examEndpoints.attemptResult.replace(':id', attemptId.toString());

  return useApiQuery<ExamResult>(
    attemptQueryKeys.result(attemptId),
    endpoint,
    {
      enabled: !!attemptId,
      staleTime: 0, // Always get fresh results
    }
  );
};

/**
 * Hook for fetching flagged questions for an attempt
 */
export const useFlaggedQuestions = (attemptId: number) => {
  const endpoint = examEndpoints.flaggedQuestions.replace(':id', attemptId.toString());

  return useApiQuery<FlaggedQuestion[]>(
    attemptQueryKeys.flags(attemptId),
    endpoint,
    {
      enabled: !!attemptId,
      staleTime: 60 * 1000, // 1 minute
    }
  );
};

// Mutation Hooks

/**
 * Hook for starting an exam
 */
export const useStartExamMutation = (examId: number) => {
  const queryClient = useQueryClient();
  const endpoint = examEndpoints.startExam.replace(':id', examId.toString());

  return useApiMutation<ExamAttempt, { userId?: string }>(
    endpoint,
    {
      onSuccess: (data) => {
        // Invalidate relevant queries
        queryClient.invalidateQueries(examApiHooks.queryKeys.detail(examId));
        queryClient.invalidateQueries(attemptQueryKeys.userAttemptsForExam(examId));
      }
    }
  );
};

/**
 * Hook for answering a question
 */
export const useAnswerQuestionMutation = (attemptId: number, questionId: number) => {
  const endpoint = examEndpoints.answerQuestion
    .replace(':attemptId', attemptId.toString())
    .replace(':questionId', questionId.toString());

  return useApiMutation<void, { selectedOption: number }>(
    endpoint
  );
};

/**
 * Hook for flagging a question
 */
export const useFlagQuestionMutation = (attemptId: number, questionId: number) => {
  const queryClient = useQueryClient();
  const endpoint = examEndpoints.flagQuestion
    .replace(':attemptId', attemptId.toString())
    .replace(':questionId', questionId.toString());

  return useApiMutation<void, void>(
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
  const endpoint = examEndpoints.unflagQuestion
    .replace(':attemptId', attemptId.toString())
    .replace(':questionId', questionId.toString());

  return useApiMutation<void, void>(
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
  const endpoint = examEndpoints.submitExam.replace(':id', attemptId.toString());

  return useApiMutation<ExamResult, { answers?: UserAnswer[] }>(
    endpoint,
    {
      onSuccess: (data) => {
        // Invalidate relevant queries
        queryClient.invalidateQueries(attemptQueryKeys.attempt(attemptId));
        queryClient.invalidateQueries(attemptQueryKeys.result(attemptId));
        queryClient.invalidateQueries(attemptQueryKeys.userAttempts());
      }
    }
  );
};

/**
 * Hook for publishing an exam
 */
export const usePublishExamMutation = (examId: number) => {
  const queryClient = useQueryClient();
  const endpoint = examEndpoints.publishExam.replace(':id', examId.toString());

  return useApiMutation<Exam, void>(
    endpoint,
    {
      onSuccess: (data) => {
        // Invalidate relevant queries
        queryClient.invalidateQueries(examApiHooks.queryKeys.detail(examId));
        queryClient.invalidateQueries(examApiHooks.queryKeys.lists());
        queryClient.invalidateQueries([...examApiHooks.queryKeys.all(), 'published']);
      }
    }
  );
};

/**
 * Hook for archiving an exam
 */
export const useArchiveExamMutation = (examId: number) => {
  const queryClient = useQueryClient();
  const endpoint = examEndpoints.archiveExam.replace(':id', examId.toString());

  return useApiMutation<Exam, void>(
    endpoint,
    {
      onSuccess: (data) => {
        // Invalidate relevant queries
        queryClient.invalidateQueries(examApiHooks.queryKeys.detail(examId));
        queryClient.invalidateQueries(examApiHooks.queryKeys.lists());
        queryClient.invalidateQueries([...examApiHooks.queryKeys.all(), 'published']);
      }
    }
  );
};

/**
 * Hook for updating a question in an exam
 */
export const useUpdateQuestionMutation = (examId: number, questionId: number) => {
  const queryClient = useQueryClient();
  const endpoint = examEndpoints.updateQuestion
    .replace(':examId', examId.toString())
    .replace(':questionId', questionId.toString());

  return useApiMutation<Question, Partial<Question>>(
    endpoint,
    {
      method: 'PUT',
      onSuccess: (data) => {
        // Invalidate relevant queries
        queryClient.invalidateQueries([...examApiHooks.queryKeys.detail(examId), 'questions']);
      }
    }
  );
};

/**
 * Hook for uploading JSON to create exams
 */
export const useJsonExamUploadMutation = () => {
  const queryClient = useQueryClient();

  return useApiMutation<Exam, any>(
    examEndpoints.uploadJson,
    {
      onSuccess: () => {
        // Invalidate relevant queries
        queryClient.invalidateQueries(examApiHooks.queryKeys.lists());
      }
    }
  );
};

// Grouped export for convenience
export const examHooks = {
  // Standard CRUD hooks
  ...examApiHooks,

  // Exam queries
  usePublishedExams,
  useExamsByStatus,
  useExamQuestions,

  // Paper queries
  useAllPapers,
  useModelPapers,
  usePastPapers,
  useSubjectPapers,
  usePracticePapers,
  usePaperById,
  useExamStats,

  // Attempt queries
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
  usePublishExamMutation,
  useArchiveExamMutation,
  useUpdateQuestionMutation,
  useJsonExamUploadMutation,

  // Export query keys for custom hooks
  queryKeys: {
    ...examApiHooks.queryKeys,
    ...paperQueryKeys,
    ...attemptQueryKeys
  }
};
