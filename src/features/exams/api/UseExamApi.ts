/**
 * Exam API Hooks
 * 
 * Custom hooks for interacting with exam-related API endpoints
 * using the tanstack-query-api hooks.
 */

import { 
  useApiQuery, 
  useApiMutation
} from '@/features/tanstack-query-api';
import { useQueryClient } from '@tanstack/react-query';
import { examEndpoints } from './core/examService';
import { examQueryKeys, paperQueryKeys } from '../api/core/queryKeys';
import { 
  Exam, 
  ExamPaper,
  ExamAttempt, 
  ExamResult, 
  Question, 
  UserAnswer,
  ExamStatus,
  FlaggedQuestion,
  ExamStats
} from '../types/StandardTypes';

// Exam Queries

/**
 * Hook for fetching all exams (admin/instructor only)
 */
export const useExams = () => {
  return useApiQuery<Exam[]>(
    examQueryKeys.lists(),
    examEndpoints.getAllExams,
    {
      requiresAuth: true,
      staleTime: 5 * 60 * 1000, // 5 minutes
    }
  );
};

/**
 * Hook for fetching published exams
 */
export const usePublishedExams = () => {
  return useApiQuery<Exam[]>(
    examQueryKeys.published(),
    examEndpoints.getPublishedExams,
    {
      requiresAuth: false, // Public endpoint
      staleTime: 5 * 60 * 1000, // 5 minutes
    }
  );
};

/**
 * Hook for fetching a specific exam by ID
 */
export const useExam = (id: number) => {
  return useApiQuery<Exam>(
    examQueryKeys.detail(id),
    examEndpoints.getExamById(id),
    {
      enabled: !!id,
      staleTime: 5 * 60 * 1000, // 5 minutes
    }
  );
};

/**
 * Hook for fetching exam questions
 */
export const useExamQuestions = (examId: number) => {
  return useApiQuery<Question[]>(
    examQueryKeys.questions(examId),
    examEndpoints.getExamQuestions(examId),
    {
      enabled: !!examId,
      staleTime: 5 * 60 * 1000, // 5 minutes
    }
  );
};

/**
 * Hook for fetching exams by status
 */
export const useExamsByStatus = (status: ExamStatus) => {
  return useApiQuery<Exam[]>(
    examQueryKeys.byStatus(status.toString()),
    examEndpoints.getExamsByStatus(status.toString()),
    {
      requiresAuth: true,
      enabled: !!status,
      staleTime: 5 * 60 * 1000, // 5 minutes
    }
  );
};

// Paper Queries

/**
 * Hook for fetching all papers
 */
export const useAllPapers = () => {
  return useApiQuery<ExamPaper[]>(
    paperQueryKeys.lists(),
    examEndpoints.getAllPapers,
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
    examEndpoints.getModelPapers,
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
    examEndpoints.getPastPapers,
    {
      staleTime: 5 * 60 * 1000, // 5 minutes
    }
  );
};

/**
 * Hook for fetching a specific paper by ID
 */
export const usePaperById = (id: number) => {
  return useApiQuery<ExamPaper>(
    paperQueryKeys.detail(id),
    examEndpoints.getPaperById(id),
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
    examEndpoints.getExamStats,
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
    examQueryKeys.userAttempts(),
    examEndpoints.getUserExamAttempts(),
    {
      requiresAuth: true,
      staleTime: 5 * 60 * 1000, // 5 minutes
    }
  );
};

/**
 * Hook for fetching a user's exam attempts for a specific exam
 */
export const useUserExamAttemptsForExam = (examId: number) => {
  return useApiQuery<ExamAttempt[]>(
    examQueryKeys.userAttemptsForExam(examId),
    examEndpoints.getUserExamAttemptsForExam(examId),
    {
      requiresAuth: true,
      enabled: !!examId,
      staleTime: 5 * 60 * 1000, // 5 minutes
    }
  );
};

/**
 * Hook for fetching a specific exam attempt
 */
export const useExamAttempt = (attemptId: number) => {
  return useApiQuery<ExamAttempt>(
    examQueryKeys.attempt(attemptId),
    examEndpoints.getExamAttempt(attemptId),
    {
      requiresAuth: true,
      enabled: !!attemptId,
      staleTime: 5 * 60 * 1000, // 5 minutes
    }
  );
};

/**
 * Hook for fetching exam results
 */
export const useExamResult = (attemptId: number) => {
  return useApiQuery<ExamResult>(
    examQueryKeys.result(attemptId),
    examEndpoints.getExamResult(attemptId),
    {
      requiresAuth: true,
      enabled: !!attemptId,
      staleTime: 0, // Always get fresh results
    }
  );
};

/**
 * Hook for fetching flagged questions for an attempt
 */
export const useFlaggedQuestions = (attemptId: number) => {
  return useApiQuery<FlaggedQuestion[]>(
    examQueryKeys.flags(attemptId),
    examEndpoints.getFlaggedQuestions(attemptId),
    {
      requiresAuth: true,
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
  
  return useApiMutation<ExamAttempt, { userId: string }>(
    examEndpoints.startExam(examId),
    {
      requiresAuth: true,
      onSuccess: (data) => {
        // Invalidate relevant queries
        queryClient.invalidateQueries(examQueryKeys.detail(examId));
      }
    }
  );
};

/**
 * Hook for answering a question
 */
export const useAnswerQuestionMutation = (examId: number, questionId: number) => {
  return useApiMutation<void, { selectedOption: number }>(
    examEndpoints.answerQuestion(examId, questionId),
    {
      requiresAuth: true
    }
  );
};

/**
 * Hook for flagging a question
 */
export const useFlagQuestionMutation = (attemptId: number, questionId: number) => {
  const queryClient = useQueryClient();
  
  return useApiMutation<void, void>(
    examEndpoints.flagQuestion(attemptId, questionId),
    {
      requiresAuth: true,
      onSuccess: () => {
        // Invalidate flagged questions query
        queryClient.invalidateQueries(examQueryKeys.flags(attemptId));
      }
    }
  );
};

/**
 * Hook for unflagging a question
 */
export const useUnflagQuestionMutation = (attemptId: number, questionId: number) => {
  const queryClient = useQueryClient();
  
  return useApiMutation<void, void>(
    examEndpoints.unflagQuestion(attemptId, questionId),
    {
      requiresAuth: true,
      onSuccess: () => {
        // Invalidate flagged questions query
        queryClient.invalidateQueries(examQueryKeys.flags(attemptId));
      }
    }
  );
};

/**
 * Hook for submitting an exam
 */
export const useSubmitExamMutation = (examId: number) => {
  const queryClient = useQueryClient();
  
  return useApiMutation<ExamResult, void>(
    examEndpoints.submitExam(examId),
    {
      requiresAuth: true,
      onSuccess: (data) => {
        // Invalidate relevant queries
        queryClient.invalidateQueries(examQueryKeys.detail(examId));
      }
    }
  );
};

/**
 * Grouped export for convenience
 */
export const examApiHooks = {
  // Exam queries
  useExams,
  usePublishedExams,
  useExam,
  useExamQuestions,
  useExamsByStatus,
  
  // Paper queries  
  useAllPapers,
  useModelPapers,
  usePastPapers,
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
  useSubmitExamMutation
};