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
import { examEndpoints } from '../core/examService';
import { examQueryKeys } from '../core/queryKeys';
import { 
  Exam, 
  ExamAttempt, 
  ExamResult, 
  Question, 
  UserAnswer,
  ExamStatusType 
} from '../../model/mcqTypes';

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
export const useExamsByStatus = (status: ExamStatusType) => {
  return useApiQuery<Exam[]>(
    examQueryKeys.byStatus(status),
    examEndpoints.getExamsByStatus(status),
    {
      requiresAuth: true,
      enabled: !!status,
      staleTime: 5 * 60 * 1000, // 5 minutes
    }
  );
};

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
 * Hook for fetching flagged questions for an attempt
 */
export const useFlaggedQuestions = (attemptId: number) => {
  return useApiQuery<{ questionId: number, attemptId: number }[]>(
    examQueryKeys.flags(attemptId),
    examEndpoints.getFlaggedQuestions(attemptId),
    {
      requiresAuth: true,
      enabled: !!attemptId,
      staleTime: 60 * 1000, // 1 minute
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
  // Query hooks
  useExams,
  usePublishedExams,
  useExam,
  useExamQuestions,
  useExamsByStatus,
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