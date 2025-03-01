/**
 * Exam queries hook
 * Provides queries for fetching exam data
 */
import { useQuery } from '@tanstack/react-query';
import { examService } from '../api/core/examService';
import { examQueryKeys } from '../api/core/queryKeys';

/**
 * Hook for fetching all published exams
 */
export const usePublishedExams = () => {
  return useQuery({
    queryKey: examQueryKeys.lists.published(),
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
    queryKey: examQueryKeys.lists.byStatus(status),
    queryFn: () => examService.getExamsByStatus(status),
    enabled: !!status
  });
};

/**
 * Hook for fetching a user's exam attempts
 */
export const useUserExamAttempts = (userId: string) => {
  return useQuery({
    queryKey: examQueryKeys.lists.userAttempts(userId),
    queryFn: () => examService.getUserAttempts(userId),
    enabled: !!userId
  });
};

/**
 * Hook for fetching a specific exam attempt
 */
export const useExamAttempt = (attemptId: number) => {
  return useQuery({
    queryKey: examQueryKeys.attempt(attemptId),
    queryFn: () => examService.getAttempt(attemptId),
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
