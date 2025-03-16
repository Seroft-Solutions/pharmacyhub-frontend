/**
 * Exam API Hooks
 *
 * This module exports all hooks for interacting with exam-related APIs.
 */

// Export all hooks directly
export * from './useExamApiHooks';
export * from './useExamAttemptHooks';
export * from './useExamPaperHooks';

// Import for backward compatibility aliases
import { examHooks } from './useExamApiHooks';
import { attemptHooks } from './useExamAttemptHooks';
import { 
  paperHooks,
  usePapersList, 
  useUploadJsonMutation,
  paperApiHooks
} from './useExamPaperHooks';
import {
  examApiHooks as originalExamApiHooks,
  useExamsList
} from './useExamApiHooks';

// For backward compatibility - aliases for existing components
export const useAllPapers = usePapersList;
export const useJsonExamUploadMutation = useUploadJsonMutation;

// Create a compatible version of examApiHooks that keeps the old structure
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
