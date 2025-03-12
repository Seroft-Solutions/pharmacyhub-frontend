/**
 * Exams API Feature
 * 
 * This module exports all exam-related API components, hooks, and utilities.
 */

// Export API endpoints and service
export { examEndpoints, examService } from './core/examService';

// Export query keys
export { examQueryKeys } from './core/queryKeys';

// Export API hooks
export {
  useExams,
  usePublishedExams,
  useExam,
  useExamQuestions,
  useExamsByStatus,
  useUserExamAttempts,
  useExamAttempt,
  useExamResult,
  useStartExamMutation,
  useAnswerQuestionMutation,
  useFlagQuestionMutation,
  useSubmitExamMutation,
  examApiHooks
} from './hooks/useExamApi';