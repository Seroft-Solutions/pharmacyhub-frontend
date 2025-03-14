/**
 * Exams API Feature
 * 
 * This module exports all exam-related API components, hooks, and endpoints.
 * It serves as the primary entry point for API interactions in the exams feature.
 */

// Export API endpoints
export { EXAM_ENDPOINTS } from './constants';

// Export service implementation
export { examService } from './services/examService';

// Export all hooks
export {
  // Main hooks object
  examHooks,
  examApiHooks,
  
  // Exam queries
  usePublishedExams,
  useExamsByStatus,
  useExamQuestions,
  
  // Paper queries
  useAllPapers,
  useModelPapers,
  usePastPapers,
  useSubjectPapers,
  usePracticePapers,
  usePaperById,
  useExamStats,
  
  // Attempt queries
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
  useSubmitExamMutation,
  usePublishExamMutation,
  useArchiveExamMutation,
  useUpdateQuestionMutation,
  useJsonExamUploadMutation
} from './hooks';
