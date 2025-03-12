/**
 * Exams Feature
 * 
 * This module exports all components of the exams feature for easy importing.
 * The exams feature provides a complete system for managing, taking, and analyzing exams.
 */

// Export types
export * from './model/mcqTypes';

// Export API hooks and utilities
export * from './api';

// Export hooks
export * from './hooks';

// Export UI components
export * from './ui';

// Export store
export { useExamStore } from './store/examStore';

// Export sample data
export * from './data/sampleExamData';