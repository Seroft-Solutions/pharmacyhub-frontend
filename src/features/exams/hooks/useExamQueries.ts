/**
 * Exam queries hook
 * Provides queries for fetching exam data using tanstack-query-api hooks
 */
import { useMemo } from 'react';
import { 
  useExamDetail, 
  usePublishedExams, 
  useExamsByStatus,
  useUserExamAttempts,
  useExamAttempt
} from '../api/hooks';
import type { ExamStatus } from '../types';

/**
 * Hook for fetching a specific exam by ID
 */
export const useExam = (examId: number) => {
  return useExamDetail(examId);
};

/**
 * Hook for fetching all published exams
 */
export const useAllPublishedExams = () => {
  const result = usePublishedExams();
  
  // Extract data from API response structure
  const exams = useMemo(() => {
    if (!result.data) return [];
    
    // Handle case where backend returns data in a wrapper
    if (result.data.data) {
      return result.data.data;
    }
    
    // Handle case where data is already unwrapped
    if (Array.isArray(result.data)) {
      return result.data;
    }
    
    return [];
  }, [result.data]);
  
  return {
    ...result,
    exams
  };
};

/**
 * Hook for fetching exams by status
 */
export const useExamsByStatusQuery = (status: ExamStatus) => {
  const result = useExamsByStatus(status);
  
  // Extract data from API response structure
  const exams = useMemo(() => {
    if (!result.data) return [];
    
    // Handle case where backend returns data in a wrapper
    if (result.data.data) {
      return result.data.data;
    }
    
    // Handle case where data is already unwrapped
    if (Array.isArray(result.data)) {
      return result.data;
    }
    
    return [];
  }, [result.data]);
  
  return {
    ...result,
    exams
  };
};

/**
 * Hook for fetching a user's exam attempts
 */
export const useUserAttempts = () => {
  const result = useUserExamAttempts();
  
  // Extract data from API response structure
  const attempts = useMemo(() => {
    if (!result.data) return [];
    
    // Handle case where backend returns data in a wrapper
    if (result.data.data) {
      return result.data.data;
    }
    
    // Handle case where data is already unwrapped
    if (Array.isArray(result.data)) {
      return result.data;
    }
    
    return [];
  }, [result.data]);
  
  return {
    ...result,
    attempts
  };
};

/**
 * Hook for fetching a specific exam attempt
 */
export const useAttempt = (attemptId: number) => {
  return useExamAttempt(attemptId);
};

/**
 * Export named hooks
 */
export const useExamQueries = {
  useExam,
  useAllPublishedExams,
  useExamsByStatus: useExamsByStatusQuery,
  useUserAttempts,
  useAttempt
};

export default useExamQueries;