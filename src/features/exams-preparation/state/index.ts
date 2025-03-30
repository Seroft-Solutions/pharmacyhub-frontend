/**
 * State management exports for exams feature
 * 
 * This module follows the core-as-foundation principle by using patterns
 * that could be promoted to core in the future.
 */

// Store factories and utilities
export * from './storeFactory';
export * from './contextFactory';

// Zustand stores
export * from './stores/examEditorStore';
export * from './stores/examAttemptStore';

// Context providers
export * from './contexts/ExamFilterContext';
export * from './contexts/ExamSessionContext';
