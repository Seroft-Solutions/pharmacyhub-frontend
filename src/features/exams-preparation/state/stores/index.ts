/**
 * Export all stores for the exams-preparation feature
 * 
 * This module provides a clean interface for accessing all exam-related stores
 * and their associated selectors through a single import.
 */

// Export the exam store and its selectors
export {
  useExamStore,
  useExamId,
  useAttemptId,
  useCurrentQuestion,
  useExamProgress,
  useExamTimer,
  useExamNavigation,
} from './examStore';

// Export the exam editor store and its selectors
export {
  useExamEditorStore,
  useCurrentQuestionIndex,
  useIsDirty,
  useQuestions,
  useValidation,
} from './examEditorStore';

// Export the exam attempt store and its selectors
export {
  useExamAttemptStore,
  useAttemptStatus,
  useAttemptAnswers,
  useAttemptProgress,
  useCurrentAttemptQuestion,
} from './examAttemptStore';

// Export the exam preparation store and its selectors
export {
  useExamPreparationStore,
  useAvailableExams,
  useIsLoading,
  useError,
} from './examPreparationStore';
