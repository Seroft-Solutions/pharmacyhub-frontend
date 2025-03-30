/**
 * API Hooks for Exams Preparation
 * 
 * This module exports React Query hooks for data fetching in the exams-preparation feature.
 * These hooks leverage the core API module and follow established patterns.
 */

// Export individual primary hooks
export * from './useExams';
export * from './useExam';
export * from './useExamAttempt';
export * from './useExamResult';
export * from './useExamPayments';

// Export comprehensive API hook sets
export * from './useExamApiHooks';
export * from './useExamAttemptHooks';
export * from './useExamPaperHooks';

// Export hook factories
export * from './hookFactory';
