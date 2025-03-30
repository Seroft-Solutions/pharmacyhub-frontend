/**
 * Common Exam Attempt API Hooks
 * 
 * This module is being deprecated in favor of direct core API module integration.
 * Please use the specialized hooks in useExamAttempt.ts instead.
 * 
 * @deprecated Use useExamAttempt.ts hooks instead
 */
import { useApiQuery, useApiMutation } from '@/core/api/hooks';
import { attemptKeys } from '../utils/queryKeys';
import { API_ENDPOINTS } from '../constants';

// All functionality has been moved to useExamAttempt.ts
// This file is kept temporarily for backward compatibility
export const useExamAttemptHooks = () => {
  console.warn('useExamAttemptHooks is deprecated. Use hooks from useExamAttempt.ts instead.');
  return null;
};
