/**
 * Exam API Hooks
 * 
 * This module provides React hooks for interacting with exam API endpoints
 * using TanStack Query for data fetching, caching, and state management.
 */
import { 
  useApiQuery, 
  useApiMutation,
  useApiPaginatedQuery,
  UseApiQueryOptions,
  UseApiMutationOptions,
  ApiPaginationParams
} from '@/features/tanstack-query-api';
import { useQueryClient } from '@tanstack/react-query';
import { examApiService } from './examApiService';
import { examQueryKeys } from './examQueryKeys';
import { 
  Exam, 
  Question, 
  ExamAttempt, 
  UserAnswer, 
  ExamResult,
  FlaggedQuestion,
  ExamStats
} from '../../model/mcqTypes';
import { ExamStatusType } from '../../types';

/**
 * Hook for fetching all exams
 */
export function useExams(options?: UseApiQueryOptions<Exam[]>) {
  return useApiQuery<Exam[]>(
    examQueryKeys.list(),
    async () => {
      return examApiService.getAll();
    },
    options
  );
}

/**
 * Hook for fetching published exams
 */
export function usePublishedExams(options?: UseApiQueryOptions<Exam[]>) {
  return useApiQuery<Exam[]>(
    examQueryKeys.published(),
    async () => {
      return examApiService.getPublishedExams();
    },
    options
  );
}

/**
 * Hook for fetching exams by status
 */
export function useExamsByStatus(
  status: ExamStatusType,
  options?: UseApiQueryOptions<Exam[]>
) {
  return useApiQuery<Exam[]>(
    examQueryKeys.byStatus(status),
    async () => {
      return examApiService.getExamsByStatus(status);
    },
    {
      enabled: !!status,
      ...options
    }
  );
}

/**
 * Hook for fetching a single exam by ID
 */
export function useExam(id: number, options?: UseApiQueryOptions<Exam>) {
  return useApiQuery<Exam>(
    examQueryKeys.detail(id),
    async () => {
      return examApiService.getById(id);
    },
    {
      enabled: !!id,
      ...options
    }
  );
}

/**
 * Hook for fetching exam questions
 */
export function useExamQuestions(examId: number, options?: UseApiQueryOptions<Question[]>) {
  return useApiQuery<Question[]>(
    examQueryKeys.questions(examId),
    async () => {
      return examApiService.getExamQuestions(examId);
    },
    {
      enabled: !!examId,
      ...options
    }
  );
}

/**
 * Hook for starting an exam
 */
export function useStartExam(options?: UseApiMutationOptions<ExamAttempt, Error, number>) {
  const queryClient = useQueryClient();
  
  return useApiMutation<ExamAttempt, number>(
    async (examId) => {
      return examApiService.startExam(examId);
    },
    {
      onSuccess: (data, examId) => {
        // Invalidate and refetch user's attempts for this exam
        queryClient.invalidateQueries({
          queryKey: examQueryKeys.examAttempts(examId)
        });
        
        // Invalidate all attempt queries since we have a new one
        queryClient.invalidateQueries({
          queryKey: examQueryKeys.attempts()
        });
        
        if (options?.onSuccess) {
          options.onSuccess(data, examId, null);
        }
      },
      ...options
    }
  );
}

/**
 * Hook for saving a single answer in an exam
 */
export interface SaveAnswerParams {
  attemptId: number;
  answer: UserAnswer;
}

export function useSaveAnswer(options?: UseApiMutationOptions<ExamAttempt, Error, SaveAnswerParams>) {
  return useApiMutation<ExamAttempt, SaveAnswerParams>(
    async ({ attemptId, answer }) => {
      return examApiService.saveAnswer(attemptId, answer);
    },
    options
  );
}

/**
 * Hook for submitting a completed exam
 */
export interface SubmitExamParams {
  attemptId: number;
  answers: UserAnswer[];
}

export function useSubmitExam(options?: UseApiMutationOptions<ExamResult, Error, SubmitExamParams>) {
  const queryClient = useQueryClient();
  
  return useApiMutation<ExamResult, SubmitExamParams>(
    async ({ attemptId, answers }) => {
      return examApiService.submitExam(attemptId, answers);
    },
    {
      onSuccess: (data, { attemptId }) => {
        // Update the attempt and result cache
        queryClient.invalidateQueries({
          queryKey: examQueryKeys.attempt(attemptId)
        });
        
        // Update the result cache
        queryClient.setQueryData(
          examQueryKeys.result(attemptId),
          data
        );
        
        // Update exam statistics
        queryClient.invalidateQueries({
          queryKey: examQueryKeys.stats()
        });
        
        if (options?.onSuccess) {
          options.onSuccess(data, { attemptId, answers: [] }, null);
        }
      },
      ...options
    }
  );
}

/**
 * Hook for fetching an exam result
 */
export function useExamResult(attemptId: number, options?: UseApiQueryOptions<ExamResult>) {
  return useApiQuery<ExamResult>(
    examQueryKeys.result(attemptId),
    async () => {
      return examApiService.getExamResult(attemptId);
    },
    {
      enabled: !!attemptId,
      ...options
    }
  );
}

/**
 * Hook for fetching user's exam attempts
 */
export function useUserAttempts(options?: UseApiQueryOptions<ExamAttempt[]>) {
  return useApiQuery<ExamAttempt[]>(
    examQueryKeys.attempts(),
    async () => {
      return examApiService.getUserAttempts();
    },
    options
  );
}

/**
 * Hook for fetching attempts for a specific exam by the current user
 */
export function useExamAttemptsByUser(
  examId: number, 
  options?: UseApiQueryOptions<ExamAttempt[]>
) {
  return useApiQuery<ExamAttempt[]>(
    examQueryKeys.examAttempts(examId),
    async () => {
      return examApiService.getExamAttemptsByUser(examId);
    },
    {
      enabled: !!examId,
      ...options
    }
  );
}

/**
 * Hook for flagging a question during an exam
 */
export interface FlagQuestionParams {
  attemptId: number;
  questionId: number;
}

export function useFlagQuestion(options?: UseApiMutationOptions<ExamAttempt, Error, FlagQuestionParams>) {
  const queryClient = useQueryClient();
  
  return useApiMutation<ExamAttempt, FlagQuestionParams>(
    async ({ attemptId, questionId }) => {
      return examApiService.flagQuestion(attemptId, questionId);
    },
    {
      onSuccess: (data, { attemptId }) => {
        // Invalidate and refetch flagged questions for this attempt
        queryClient.invalidateQueries({
          queryKey: examQueryKeys.flagged(attemptId)
        });
        
        if (options?.onSuccess) {
          options.onSuccess(data, { attemptId, questionId: 0 }, null);
        }
      },
      ...options
    }
  );
}

/**
 * Hook for unflagging a question
 */
export function useUnflagQuestion(options?: UseApiMutationOptions<ExamAttempt, Error, FlagQuestionParams>) {
  const queryClient = useQueryClient();
  
  return useApiMutation<ExamAttempt, FlagQuestionParams>(
    async ({ attemptId, questionId }) => {
      return examApiService.unflagQuestion(attemptId, questionId);
    },
    {
      onSuccess: (data, { attemptId }) => {
        // Invalidate and refetch flagged questions for this attempt
        queryClient.invalidateQueries({
          queryKey: examQueryKeys.flagged(attemptId)
        });
        
        if (options?.onSuccess) {
          options.onSuccess(data, { attemptId, questionId: 0 }, null);
        }
      },
      ...options
    }
  );
}

/**
 * Hook for fetching flagged questions for an attempt
 */
export function useFlaggedQuestions(
  attemptId: number, 
  options?: UseApiQueryOptions<FlaggedQuestion[]>
) {
  return useApiQuery<FlaggedQuestion[]>(
    examQueryKeys.flagged(attemptId),
    async () => {
      return examApiService.getFlaggedQuestions(attemptId);
    },
    {
      enabled: !!attemptId,
      ...options
    }
  );
}

/**
 * Hook for fetching paginated exams
 */
export interface ExamListParams extends ApiPaginationParams {
  status?: ExamStatusType;
}

export function usePaginatedExams(
  params: ExamListParams,
  options?: UseApiQueryOptions<Exam[]>
) {
  const { page, size, status } = params;
  
  const queryKey = status 
    ? examQueryKeys.byStatus(status)
    : examQueryKeys.list();
  
  return useApiPaginatedQuery<Exam[]>(
    queryKey,
    status
      ? `/api/v1/exams/status/${status}`
      : '/api/v1/exams',
    { page, size },
    options
  );
}

/**
 * Hook for fetching exam statistics
 */
export function useExamStats(options?: UseApiQueryOptions<ExamStats>) {
  return useApiQuery<ExamStats>(
    examQueryKeys.stats(),
    async () => {
      return examApiService.getExamStats();
    },
    options
  );
}

/**
 * Complete exam session hook that integrates all exam functionality
 */
export function useExamSession(examId: number | undefined) {
  const queryClient = useQueryClient();
  
  // Fetch exam details
  const examQuery = useExam(examId as number);
  
  // Fetch exam questions
  const questionsQuery = useExamQuestions(examId as number);
  
  // Mutations
  const startExamMutation = useStartExam();
  const saveAnswerMutation = useSaveAnswer();
  const submitExamMutation = useSubmitExam();
  const flagQuestionMutation = useFlagQuestion();
  const unflagQuestionMutation = useUnflagQuestion();
  
  return {
    // Query results
    exam: examQuery.data,
    questions: questionsQuery.data,
    isLoading: examQuery.isLoading || questionsQuery.isLoading,
    error: examQuery.error || questionsQuery.error,
    
    // Mutations with their states
    startExam: startExamMutation.mutate,
    isStarting: startExamMutation.isPending,
    startError: startExamMutation.error,
    
    saveAnswer: saveAnswerMutation.mutate,
    isSaving: saveAnswerMutation.isPending,
    saveError: saveAnswerMutation.error,
    
    submitExam: submitExamMutation.mutate,
    isSubmitting: submitExamMutation.isPending,
    submitError: submitExamMutation.error,
    
    flagQuestion: flagQuestionMutation.mutate,
    unflagQuestion: unflagQuestionMutation.mutate,
    isFlagging: flagQuestionMutation.isPending || unflagQuestionMutation.isPending,
    flagError: flagQuestionMutation.error || unflagQuestionMutation.error,
    
    // Utility methods
    refetch: () => {
      examQuery.refetch();
      questionsQuery.refetch();
    },
    
    // Reset exam data in cache
    resetExam: () => {
      queryClient.invalidateQueries({
        queryKey: examQueryKeys.detail(examId as number)
      });
      queryClient.invalidateQueries({
        queryKey: examQueryKeys.questions(examId as number)
      });
    }
  };
}

export default {
  useExams,
  usePublishedExams,
  useExamsByStatus,
  useExam,
  useExamQuestions,
  useStartExam,
  useSaveAnswer,
  useSubmitExam,
  useExamResult,
  useUserAttempts,
  useExamAttemptsByUser,
  useFlagQuestion,
  useUnflagQuestion,
  useFlaggedQuestions,
  usePaginatedExams,
  useExamStats,
  useExamSession
};
