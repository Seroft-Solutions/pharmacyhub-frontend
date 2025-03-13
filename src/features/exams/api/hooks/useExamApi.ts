/**
 * This is a forwarding module that exports hooks from the main UseExamApi.ts file
 */

export {
  useExams,
  usePublishedExams,
  useExam,
  useExamQuestions,
  useExamsByStatus,
  useAllPapers,
  useModelPapers,
  usePastPapers,
  usePaperById,
  useExamStats,
  useUserExamAttempts,
  useUserExamAttemptsForExam,
  useExamAttempt,
  useExamResult,
  useFlaggedQuestions,
  useStartExamMutation,
  useAnswerQuestionMutation,
  useFlagQuestionMutation,
  useUnflagQuestionMutation,
  useSubmitExamMutation,
  examApiHooks
} from '../UseExamApi';