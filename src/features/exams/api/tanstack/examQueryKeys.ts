/**
 * Exam Query Keys
 * 
 * This module defines the query keys used for caching exam-related data
 * with TanStack Query.
 */
import { createQueryKeys } from '@/features/tanstack-query-api';
import { ExamStatusType } from '../../types';

/**
 * Query keys for exam-related data
 */
export const examQueryKeys = createQueryKeys({
  /** Base key for all exam-related queries */
  all: () => ['exams'] as const,
  
  /** Key for fetching all exams */
  list: () => [...examQueryKeys.all(), 'list'] as const,

  /** Key for published exams */
  published: () => [...examQueryKeys.all(), 'published'] as const,
  
  /** Key for exams with a specific status */
  byStatus: (status?: ExamStatusType) => 
    [...examQueryKeys.all(), 'status', status] as const,
  
  /** Key for a specific exam */
  detail: (id: number) => [...examQueryKeys.all(), 'detail', id] as const,
  
  /** Key for questions of a specific exam */
  questions: (examId: number) => 
    [...examQueryKeys.detail(examId), 'questions'] as const,
  
  /** Key for user's exam attempts */
  attempts: (userId?: string) => 
    [...examQueryKeys.all(), 'attempts', userId] as const,
  
  /** Key for exam attempts by a specific user for a specific exam */
  examAttempts: (examId: number, userId?: string) => 
    [...examQueryKeys.detail(examId), 'attempts', userId] as const,
  
  /** Key for a specific exam attempt */
  attempt: (attemptId: number) => 
    [...examQueryKeys.all(), 'attempt', attemptId] as const,
  
  /** Key for an exam result */
  result: (attemptId: number) => 
    [...examQueryKeys.attempt(attemptId), 'result'] as const,
  
  /** Key for flagged questions in an exam attempt */
  flagged: (attemptId: number) => 
    [...examQueryKeys.attempt(attemptId), 'flagged'] as const,
  
  /** Key for exam statistics */
  stats: () => [...examQueryKeys.all(), 'stats'] as const,
});

export default examQueryKeys;
