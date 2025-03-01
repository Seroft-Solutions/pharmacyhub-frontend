/**
 * Exams Feature Hooks
 * 
 * This module exports all hooks for the exams feature, including
 * both legacy hooks and TanStack Query hooks.
 */

// Legacy hooks
export * from './useExams';
export * from './useExamQueries';

// TanStack Query hooks
export {
  useTanstackExams,
  useTanstackExamSession
} from './useTanstackExams';

// Default export for convenience
export { default } from './useTanstackExams';
