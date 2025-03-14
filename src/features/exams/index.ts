/**
 * Exams Feature Module
 * 
 * This module provides components, hooks, and utilities for working with exams.
 * It serves as the main entry point for the entire exams feature.
 */

// Export all types
export * from './types';

// Export API hooks and services
export * from './api';

// Export components
export { default as ExamContainer } from './components/ExamContainer';
export { default as ExamProgress } from './components/ExamProgress';
export { default as ExamResults } from './components/ExamResults';
export { default as ExamSummary } from './components/ExamSummary';
export { default as ExamTimer } from './components/ExamTimer';
export { QuestionDisplay } from './components/QuestionDisplay';
export { default as QuestionNavigation } from './components/QuestionNavigation';
export { default as NetworkStatusIndicator } from './components/NetworkStatusIndicator';

// Export layout components
export * from './components/layout';

// Export sidebar components
export * from './components/sidebar';

// Export admin components
export * from './components/admin';

// Export hooks
export * from './hooks';

// Export stores
export { useMcqExamStore } from './store/mcqExamStore';
export { useExamStore } from './store/examStore';
export { examStoreAdapter } from './store/examStoreAdapter';

// Export utilities
export * from './utils/formatTime';
export * from './utils/jsonExamProcessor';
export * from './utils/paperTypeUtils';
