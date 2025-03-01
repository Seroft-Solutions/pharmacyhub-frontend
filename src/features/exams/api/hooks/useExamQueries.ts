/**
 * These hooks provides query functionality for exams using the TanStack Query API
 * They handle data fetching for various exam-related entities
 */

import { useApiQuery } from '@/features/tanstack-query-api';
import { examQueryKeys } from '../core/queryKeys';
import { Exam, ExamResult, ExamStatusType, FlaggedQuestion } from '../../model/mcqTypes';

/**
 * Hook for fetching all exams
 */
export const useExams = () => {
  return useApiQuery<Exam[]>(
    examQueryKeys.lists(),
    '/api/v1/exams',
    {
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
    '/api/v1/exams/published',
    {
      staleTime: 5 * 60 * 1000, // 5 minutes
    }
  );
};

/**
 * Hook for fetching an exam by ID
 */
export const useExam = (id: number) => {
  return useApiQuery<Exam>(
    examQueryKeys.detail(id),
    `/api/v1/exams/${id}`,
    {
      enabled: !!id,
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
    `/api/v1/exams/status/${status}`,
    {
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
    `/api/v1/exams/attempts/${attemptId}/result`,
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
  return useApiQuery<FlaggedQuestion[]>(
    examQueryKeys.flags(attemptId),
    `/api/v1/exams/attempts/${attemptId}/flags`,
    {
      enabled: !!attemptId,
      staleTime: 0, // Always get fresh flags
    }
  );
};
