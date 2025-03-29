/**
 * Exams Query Keys
 * 
 * This module provides query key factory for the exams feature.
 * Use these query keys for all exams-related API calls with TanStack Query.
 */
import { createQueryKeyFactory } from '@/core/api/utils/queryKeyFactory';

/**
 * Action types for the exams feature
 */
export type ExamAction = 
  | 'active'
  | 'upcoming'
  | 'completed'
  | 'recommended'
  | 'popular'
  | 'results'
  | 'stats'
  | 'progress'
  | 'favorites';

/**
 * Query keys for the exams feature
 */
export const examKeys = createQueryKeyFactory<ExamAction>('exams');

/**
 * Example usage:
 * 
 * ```typescript
 * // Get all exams
 * examKeys.all(); // ['exams']
 * 
 * // Get a list of exams with filters
 * examKeys.lists({ category: 'pharmacy' }); // ['exams', 'list', { category: 'pharmacy' }]
 * 
 * // Get a specific exam
 * examKeys.detail('123'); // ['exams', 'detail', '123']
 * 
 * // Get active exams
 * examKeys.action('active'); // ['exams', 'active']
 * 
 * // Get exam results for a specific user
 * examKeys.action('results', { userId: '123' }); // ['exams