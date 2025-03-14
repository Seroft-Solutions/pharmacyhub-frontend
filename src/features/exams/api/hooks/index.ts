/**
 * Exam API Hooks
 * 
 * This module exports all hooks for exam-related operations.
 */
export {
  // Main hooks object
  examHooks,
  examApiHooks,
  
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
} from './useExamApi';
