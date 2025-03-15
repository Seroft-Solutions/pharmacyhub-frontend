/**
 * Exam queries hook
 * Provides queries for fetching exam data
 */
import { useQuery } from '@tanstack/react-query';
import { examService } from '../api/services';
import { examQueryKeys } from '../api/hooks/useExamApiHooks';

/**
 * Hook for fetching all published exams
 */
export const usePublishedExams = () => {
  return useQuery({
    queryKey: examQueryKeys.published(),
    queryFn: () => examService.getPublishedExams()
  });
};

/**
 * Hook for fetching a specific exam by ID
 */
export const useExam = (examId: number) => {
  return useQuery({
    queryKey: examQueryKeys.detail(examId),
    queryFn: () => examService.getExamById(examId),
    enabled: !!examId
  });
};

/**
 * Hook for fetching exams by status
 */
export const useExamsByStatus = (status: string) => {
  return useQuery({
    queryKey: examQueryKeys.byStatus(status),
    queryFn: () => examService.getExamsByStatus(status),
    enabled: !!status
  });
};

/**
 * Hook for fetching a user's exam attempts
 */
export const useUserExamAttempts = (userId: string) => {
  return useQuery({
    queryKey: [...examQueryKeys.all(), 'userAttempts', userId],
    queryFn: () => examService.getUserExamAttempts(),
    enabled: !!userId
  });
};

/**
 * Hook for fetching a specific exam attempt
 */
export const useExamAttempt = (attemptId: number) => {
  return useQuery({
    queryKey: [...examQueryKeys.all(), 'attempt', attemptId],
    queryFn: () => examService.getExamAttempt(attemptId),
    enabled: !!attemptId
  });
};

/**
 * Export named hooks
 */
export const useExamQueries = {
  usePublishedExams,
  useExam,
  useExamsByStatus,
  useUserExamAttempts,
  useExamAttempt
};

export default useExamQueries;