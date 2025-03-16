/**
 * Exam API Module
 *
 * This module provides a comprehensive set of hooks and services for exam-related operations.
 * It leverages the tanstack-query-api feature for consistent API handling across the application.
 */

// Export all hooks
export * from './hooks';

// Export all services
export * from './services';

// Export constants
export * from './constants';

// Export adapter for backward compatibility
export * from './adapter';

// Direct exports of frequently used hooks for convenience
export { 
  useModelPapers,
  usePastPapers,
  useSubjectPapers,
  usePracticePapers 
} from './hooks/useExamPaperHooks';
