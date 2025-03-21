/**
 * Exam API Hooks
 * 
 * Custom React Query hooks for exam operations
 */
import { UseMutationResult, UseQueryResult } from '@tanstack/react-query';
import { useApiMutation, useApiQuery } from '@/features/core/tanstack-query-api';
import { EXAM_ENDPOINTS } from '../constants/endpoints';
import { ExamPaper } from '../../types/StandardTypes';

/**
 * Utility function to ensure IDs are properly converted to numbers
 * This is important because the Java backend expects Long type parameters
 */
const toLongId = (id: number | string): string => {
  // Parse the ID to an integer and convert back to string to ensure valid long format
  return String(parseInt(id.toString()));
};

/**
 * Hook for getting an exam by ID
 */
export const useExamById = (examId: number): UseQueryResult<ExamPaper, Error> => {
  // Create the URL with the exam ID
  const url = String(EXAM_ENDPOINTS.getExamById).replace(':examId', toLongId(examId));
  
  return useApiQuery<ExamPaper>(
    ['exam', 'detail', examId],
    {
      url: url,
      method: 'GET'
    },
    {
      // Options
      retry: 3,
      retryDelay: 1000, // 1 second delay between retries
      staleTime: 1000 * 60 * 5, // 5 minutes
      enabled: !!examId
    }
  );
};

/**
 * Hook for getting all exams
 */
export const useAllExams = (): UseQueryResult<ExamPaper[], Error> => {
  return useApiQuery<ExamPaper[]>(
    ['exam', 'list'],
    {
      url: EXAM_ENDPOINTS.getAllExams,
      method: 'GET'
    },
    {
      // Options
      retry: 2,
      staleTime: 1000 * 60 * 5, // 5 minutes
    }
  );
};

/**
 * Export all hooks together for convenience
 */
export const examApiHooks = {
  useExamById,
  useAllExams
};

export default examApiHooks;