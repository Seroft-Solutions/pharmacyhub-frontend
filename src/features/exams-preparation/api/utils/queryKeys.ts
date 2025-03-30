/**
 * Exams Preparation Query Keys
 * 
 * This module provides query keys for the exams-preparation feature using the
 * core API module's query key factory for consistency.
 */
import { createQueryKeyFactory } from '@/core/api/utils/queryKeyFactory';
import { ExamStatus } from '../../types';

/**
 * Query keys for the exams-preparation feature following core API patterns
 */
export const examKeys = createQueryKeyFactory<
  | 'published'
  | 'status'
  | 'questions'
  | 'stats'
  | 'attempts'
  | 'results'
  | 'papers'
>('exams-preparation');

/**
 * Extended utility functions for creating complex query keys with typed parameters
 * These follow the Core API patterns while providing domain-specific convenience methods
 */
export const examsQueryKeys = {
  // Get all exams
  all: examKeys.all,
  
  // Get lists of exams with optional filters
  lists: (filters?: Record<string, any>) => examKeys.lists(filters),
  
  // Get exam detail by ID
  detail: (id: number) => examKeys.detail(id),
  
  // Published exams
  published: () => examKeys.action('published'),
  
  // Exams by status
  byStatus: (status: ExamStatus) => 
    examKeys.action('status', { status: status.toString() }),
  
  // Questions for an exam
  questions: (examId: number) => 
    examKeys.action('questions', { examId }),
    
  // Exam statistics
  stats: () => examKeys.action('stats'),
  
  // Filter for invalidating all exam queries
  filter: examKeys.filter,
  
  // Attempt-related query keys
  attempts: {
    all: () => [...examKeys.all(), 'attempts'] as const,
    lists: (filters?: Record<string, any>) => 
      filters 
        ? [...examKeys.all(), 'attempts', 'list', filters] as const 
        : [...examKeys.all(), 'attempts', 'list'] as const,
    detail: (attemptId: number) => [...examKeys.all(), 'attempts', 'detail', attemptId] as const,
    byExam: (examId: number) => [...examKeys.all(), 'attempts', 'byExam', examId] as const,
    result: (attemptId: number) => [...examKeys.all(), 'attempts', 'result', attemptId] as const,
  },
  
  // Paper-related query keys
  papers: {
    all: () => [...examKeys.all(), 'papers'] as const,
    lists: (filters?: Record<string, any>) => 
      filters 
        ? [...examKeys.all(), 'papers', 'list', filters] as const 
        : [...examKeys.all(), 'papers', 'list'] as const,
    detail: (paperId: number) => [...examKeys.all(), 'papers', 'detail', paperId] as const,
    model: () => [...examKeys.all(), 'papers', 'model'] as const,
    past: () => [...examKeys.all(), 'papers', 'past'] as const,
    subject: () => [...examKeys.all(), 'papers', 'subject'] as const,
    practice: () => [...examKeys.all(), 'papers', 'practice'] as const,
  },
};

/**
 * Export attempt query keys separately for convenience
 */
export const attemptKeys = examsQueryKeys.attempts;

/**
 * Export paper query keys separately for convenience
 */
export const paperKeys = examsQueryKeys.papers;

export default examsQueryKeys;
