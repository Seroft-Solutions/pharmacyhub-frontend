/**
 * Exams Preparation Feature State Management
 * 
 * This module exports all state management utilities for the exams-preparation feature.
 * It leverages core state management utilities to ensure consistent patterns
 * across the application while providing feature-specific implementations.
 */

// Re-export core state management utilities directly
export {
  createContextProvider,
  withContextProvider,
} from '@/core/state';

// Export feature-specific store factory
export { 
  createExamsStore,
  createExamsSelectors,
  createTestStore,
  FEATURE_NAME as STORE_FEATURE_NAME,
  type StoreOptions,
  type ExamsStoreOptions,
  type ExtractState,
  type ExtractStateOnly,
  type ExtractActions,
  StoreErrorType,
  StoreError
} from './storeFactory';

// Export feature-specific context factory
export {
  createExamsContext,
  withExamsContext,
  createTestProvider,
  FEATURE_NAME as CONTEXT_FEATURE_NAME,
  type ExamsContextOptions,
  type ContextOptions,
  LogLevel,
  ContextErrorType,
  ContextError,
  type ExtractContextState,
  type ExtractContextValue
} from './contextFactory';

// Export contexts
export {
  ExamFilterProvider,
  useExamFilter,
  useHasActiveFilters,
  withExamFilters,
} from './contexts/ExamFilterContext';

export {
  ExamSessionProvider,
  useExamSession,
} from './contexts/ExamSessionContext';

export {
  QuestionProvider,
  useQuestion,
} from './contexts/QuestionContext';

export {
  TimerProvider,
  useTimer,
} from './contexts/TimerContext';

// Export stores
export {
  useExamStore,
  useExamId,
  useAttemptId,
  useCurrentQuestion,
  useExamProgress,
  useExamTimer,
  useExamNavigation,
} from './stores/examStore';

export {
  examEditorStore,
  useExamEditorStore,
  useCurrentQuestionIndex,
  useIsDirty,
  useQuestions,
  useValidation,
  useExam,
  useCurrentQuestion,
  useCanUndo,
  useCanRedo,
  useQuestionValidation,
  useExamValidation,
  useTotalQuestionsCount,
  useTotalPoints,
} from './stores/examEditorStore';

export {
  useExamAttemptStore,
  useAttemptStatus,
  useAttemptAnswers,
  useAttemptProgress,
  useCurrentAttemptQuestion,
} from './stores/examAttemptStore';

export {
  useExamPreparationStore,
  useAvailableExams,
  useIsLoading,
  useError,
} from './stores/examPreparationStore';
