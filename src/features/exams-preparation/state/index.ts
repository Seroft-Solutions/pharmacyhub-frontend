/**
 * State management exports for exams-preparation feature
 * 
 * This module follows the core-as-foundation principle by using patterns
 * that could be promoted to core in the future.
 */

// Store factories and utilities
export * from './storeFactory';
export * from './contextFactory';

// Zustand stores
export * from './stores';

// Context providers
export * from './contexts/ExamFilterContext';
export * from './contexts/ExamSessionContext';
export * from './contexts/QuestionContext';
export * from './contexts/TimerContext';
