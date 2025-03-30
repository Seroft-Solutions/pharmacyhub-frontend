/**
 * Exams Preparation Feature
 * 
 * This feature module follows the Feature-First Organization pattern
 * and fully leverages core modules as the foundation.
 * 
 * The exams-preparation feature allows users to create, take, and manage exams
 * with support for premium content via payment integration.
 *
 * Public API
 * ---------
 * This module carefully exports only the components, hooks, and utilities
 * that are intended to be used by other features or app pages.
 */

// Re-export from components (using named exports to control public API surface)
export { 
  // Atoms
  ExamStatusBadge,
  TimeRemainingComponent,
  LoadingState,
  ErrorState,
  EmptyState,
} from './components/atoms';

export {
  // Molecules
  ExamPaperCard,
  ExamMetadata,
  ExamTimer,
  ExamAlertDialog,
} from './components/molecules';

export {
  // Organisms
  ExamQuestion,
  ExamsTable,
  ExamsPagination,
} from './components/organisms';

export {
  // Templates
  ExamContainer,
  ExamLayout,
  ExamResults,
} from './components/templates';

export {
  // Guards
  ExamAccessGuard,
  PremiumContentGuard,
} from './components/guards';

// API/Data hooks - export specific hooks for external use
export {
  useExams,
  useExam,
  useExamAttempt,
  useExamResult,
  useExamPayments,
} from './api/hooks';

// State management exports
export {
  // Zustand stores
  useExamStore,
  useExamAttemptStore,
  useExamPreparationStore,
  
  // Selectors
  useExamProgress,
  useExamTimer,
  useCurrentQuestion,
  useExamNavigation,
  useStudyProgress,
  useTotalStudyTime,
} from './state';

// Context providers
export {
  QuestionContextProvider,
  TimerContextProvider,
  ExamFilterProvider,
  ExamSessionProvider,
  useQuestionContext,
  useTimerContext,
  useExamFilter,
  useExamSession,
} from './state';

// Types that might be needed by other features
export type {
  Exam,
  Question,
  ExamAttempt,
  ExamResult,
  ExamAnswer,
  QuestionOption,
  DifficultyLevel,
  QuestionType,
} from './types';

// Feature-specific hooks
export * from './hooks';

// Utils
export {
  formatTime,
  formatTimeVerbose,
  calculateExamScore,
  calculateExamStatistics,
} from './utils';
