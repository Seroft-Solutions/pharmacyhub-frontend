/**
 * API Hooks
 * 
 * This module contains React Query hooks for data fetching in the exams-preparation feature.
 * These hooks leverage the core API module and follow established patterns.
 */

// Export all hooks
export * from './useExamApiHooks';
export * from './useExamAttemptHooks';
export * from './useExamPaperHooks';

// Import for backward compatibility aliases
import { examHooks } from './useExamApiHooks';
import { attemptHooks } from './useExamAttemptHooks';
import { 
  paperHooks,
  useAllPapers, 
  useUploadJsonExamMutation,
  paperApiHooks
} from './useExamPaperHooks';
import {
  examApiHooks as originalExamApiHooks,
  useExamsList
} from './useExamApiHooks';

// Export combined API hooks for convenience
export const examApiHooks = {
  ...examHooks,
  attempts: attemptHooks,
  papers: paperHooks,
  // Add direct access to methods from the original createApiHooks factory
  useList: originalExamApiHooks.useList,
  useDetail: originalExamApiHooks.useDetail,
  useCreate: originalExamApiHooks.useCreate,
  useUpdate: originalExamApiHooks.useUpdate,
  usePatch: originalExamApiHooks.usePatch,
  useDelete: originalExamApiHooks.useDelete,
  useAction: originalExamApiHooks.useAction,
  useCustomQuery: originalExamApiHooks.useCustomQuery,
  queryKeys: originalExamApiHooks.queryKeys
};

export default examApiHooks;
