/**
 * Exams Preparation API Module
 * 
 * This module serves as the public API for the exams-preparation feature's API layer.
 * It exports all hooks, constants, and utilities for interacting with the exams API.
 */

// Export all hooks
export * from './hooks';

// Export constants
export * from './constants';

// Export query keys (for custom invalidation)
export { examsQueryKeys, attemptKeys, paperKeys } from './utils/queryKeys';
