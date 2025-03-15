/**
 * UseExamApi
 * 
 * This module provides a unified API interface for the exam session functionality.
 * It connects directly to the tanstack-query-api based hooks for a single source of truth.
 * 
 * NOTE: This file exists for backward compatibility with the useExamSession hook.
 * New implementations should use the standard hooks from the api/hooks directory.
 */

import { useExamDetail as useExam, useExamStats } from './hooks/useExamApiHooks';
import { 
  useExamQuestions,
  useStartExamMutation,
  useAnswerQuestionMutation,
  useFlagQuestionMutation,
  useUnflagQuestionMutation,
  useSubmitExamMutation
} from './hooks';

// Export everything needed by useExamSession and other components
export {
  useExam,
  useExamStats,
  useExamQuestions,
  useStartExamMutation,
  useAnswerQuestionMutation,
  useFlagQuestionMutation,
  useUnflagQuestionMutation,
  useSubmitExamMutation
};
