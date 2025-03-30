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

// Re-export from components based on atomic design principles
export { 
  // Atoms (basic UI elements)
  ExamStatusBadge,
  TimeRemainingComponent,
  LoadingState,
  ErrorState,
  EmptyState,
} from './components/atoms';

export {
  // Molecules (combinations of atoms)
  ExamPaperCard,
  ExamMetadata,
  ExamTimer,
  ExamAlertDialog,
} from './components/molecules';

export {
  // Organisms (collections of molecules)
  ExamQuestion,
  ExamsTable,
  ExamsPagination,
} from './components/organisms';

export {
  // Templates (page layouts)
  ExamContainer,
  ExamLayout,
  ExamResults,
} from './components/templates';

// Guard components for access control
export {
  ExamAccessGuard,
  PremiumContentGuard,
} from './components/guards';

// API/Data hooks for data fetching and mutation
export {
  // Primary data hooks
  useExams,
  useExam,
  useExamAttempt,
  useExamResult,
  useExamPayments,
  
  // API hook sets
  useExamApiHooks,
  useExamAttemptHooks,
  useExamPaperHooks,
} from './api/hooks';

// State management exports for state handling
export {
  // Zustand stores
  useExamStore,
  useExamAttemptStore,
  useExamEditorStore,
  useExamPreparationStore,
  
  // Selectors for optimized renders
  useExamProgress,
  useExamTimer,
  useCurrentQuestion,
  useExamNavigation,
  useStudyProgress,
  useTotalStudyTime,
} from './state';

// Context providers for component-level state
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

// RBAC (Role-Based Access Control) exports
export {
  ExamPermission,
  ExamRole,
  canViewExam,
  canTakeExam,
  canViewResults,
  canCreateExam,
  canEditExam,
  canDeleteExam,
  canManagePremium,
  ExamRBACProvider,
} from './rbac';

// Type exports for public API
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
export {
  useExamNavigation,
  useExamTimer,
} from './hooks';

// Utility functions
export {
  // Time formatting utilities
  formatTime,
  formatTimeVerbose,
  
  // Exam calculation utilities
  calculateExamScore,
  formatExamResult,
  calculateExamStatistics,
  isAnswerCorrect,
  
  // Data mapping utilities
  mapExamResponseToExam,
  mapAttemptResponseToAttempt,
  mapResultResponseToResult,
  mapQuestionOptionsForDisplay,
} from './utils';
