/**
 * TanStack Query API Integration for Exams Feature
 * 
 * This module exports all components needed for integrating
 * the exam feature with TanStack Query.
 */

// Export query keys
export { examQueryKeys } from './examQueryKeys';

// Export the API service
export { examApiService } from './examApiService';

// Export all hooks
export {
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
} from './examHooks';

// Re-export types for easier usage
export type {
  SaveAnswerParams,
  SubmitExamParams,
  FlagQuestionParams,
  ExamListParams
} from './examHooks';

/**
 * Default export for convenience
 */
export { default as examHooks } from './examHooks';
