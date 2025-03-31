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
  ExamActionButtons,
} from './components/molecules';

export {
  // Organisms (collections of molecules)
  ExamQuestion,
  ExamsTable,
  ExamsPagination,
  ExamNavigation,
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

// Feature-specific API
export {
  examsPreparationApi,
  examsApi,
  papersApi,
  attemptsApi,
  paymentsApi,
} from './api';

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
  // Operations and permission types
  ExamOperation,
  ExamPermission,
  OperationPermissionMap,
  OPERATION_DESCRIPTIONS,
  
  // Permission hooks
  useExamPermission,
  useExamFeatureAccess,
  useGuardedCallback,
  useExamRoleUI,
  
  // Permission guards
  ExamOperationGuard,
  ExamRoleGuard,
  ConditionalContent,
  withExamPermission,
  AccessDeniedPage,
  
  // Legacy exports for backward compatibility
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
  ExamAttempt as Attempt,
  ExamResult as Result,
  Answer,
  PaginatedResponse,
  ExamStatus,
  QuestionType,
  DifficultyLevel,
  PaperType,
  AttemptStatus,
  PaymentStatus,
  ExamSearchParams,
  ExamCreateParams,
  ExamUpdateParams,
  QuestionCreateParams,
  QuestionUpdateParams,
  PaperBase,
  Paper,
  PaymentIntent,
  Payment,
  ExamStats,
  AccessCheckResponse,
} from './types/api/api-types';

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
