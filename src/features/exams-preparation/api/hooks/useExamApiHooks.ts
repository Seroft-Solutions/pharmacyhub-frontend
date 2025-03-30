/**
 * Common Exams API Hooks
 * 
 * This module is being deprecated in favor of direct core API module integration.
 * Please use the specialized hooks in useExam.ts, useExams.ts, etc. instead.
 * 
 * @deprecated Use specific hook files instead
 */
import { useApiQuery, useApiMutation } from '@/core/api/hooks';
import { examsQueryKeys } from '../utils/queryKeys';
import { API_ENDPOINTS } from '../constants';

// All functionality has been moved to more specific hook files
// This file is kept temporarily for backward compatibility
export const useExamApiHooks = () => {
  console.warn('useExamApiHooks is deprecated. Use specific hooks instead.');
  return null;
};
