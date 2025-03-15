/**
 * Exam Paper Hooks
 *
 * This module provides React hooks for interacting with exam paper-related APIs.
 * It leverages the createApiHooks factory from tanstack-query-api.
 */
import { createApiHooks } from '@/features/tanstack-query-api/factories/createApiHooks';
import { useQueryClient } from '@tanstack/react-query';
import { PAPER_ENDPOINTS } from '../constants';
import { examQueryKeys } from './useExamApiHooks';
import type { ExamPaper } from '../../types';

/**
 * Create standard CRUD hooks for papers
 */
export const paperApiHooks = createApiHooks<ExamPaper>(
  PAPER_ENDPOINTS,
  {
    resourceName: 'papers',
    requiresAuth: true,
    defaultStaleTime: 5 * 60 * 1000 // 5 minutes
  }
);

/**
 * Extended paper query keys
 */
export const paperQueryKeys = {
  ...paperApiHooks.queryKeys,
  model: () => [...paperApiHooks.queryKeys.all(), 'model'] as const,
  past: () => [...paperApiHooks.queryKeys.all(), 'past'] as const,
  subject: () => [...paperApiHooks.queryKeys.all(), 'subject'] as const,
  practice: () => [...paperApiHooks.queryKeys.all(), 'practice'] as const,
};

/**
 * Hook for fetching model papers
 */
export const useModelPapers = () => {
  return paperApiHooks.useCustomQuery<ExamPaper[]>(
    'model',
    'model',
    {
      staleTime: 5 * 60 * 1000, // 5 minutes
    }
  );
};

/**
 * Hook for fetching past papers
 */
export const usePastPapers = () => {
  return paperApiHooks.useCustomQuery<ExamPaper[]>(
    'past',
    'past',
    {
      staleTime: 5 * 60 * 1000, // 5 minutes
    }
  );
};

/**
 * Hook for fetching subject papers
 */
export const useSubjectPapers = () => {
  return paperApiHooks.useCustomQuery<ExamPaper[]>(
    'subject',
    'subject',
    {
      staleTime: 5 * 60 * 1000, // 5 minutes
    }
  );
};

/**
 * Hook for fetching practice papers
 */
export const usePracticePapers = () => {
  return paperApiHooks.useCustomQuery<ExamPaper[]>(
    'practice',
    'practice',
    {
      staleTime: 5 * 60 * 1000, // 5 minutes
    }
  );
};

/**
 * Hook for uploading a JSON exam
 */
export const useUploadJsonMutation = () => {
  const queryClient = useQueryClient();
  
  return paperApiHooks.useAction<ExamPaper, any>(
    PAPER_ENDPOINTS.uploadJson,
    {
      onSuccess: (data) => {
        // Invalidate all paper and exam queries
        queryClient.invalidateQueries(paperQueryKeys.lists());
        queryClient.invalidateQueries(examQueryKeys.lists());
      }
    }
  );
};

// Export standard CRUD hooks with more descriptive names
export const {
  useList: usePapersList,
  useDetail: usePaperDetail,
  useCreate: useCreatePaper,
  useUpdate: useUpdatePaper,
  usePatch: usePatchPaper,
  useDelete: useDeletePaper,
} = paperApiHooks;

// Export everything as a combined object for convenience
export const paperHooks = {
  // Standard CRUD hooks
  usePapersList,
  usePaperDetail,
  useCreatePaper,
  useUpdatePaper,
  usePatchPaper,
  useDeletePaper,

  // Specialized paper hooks
  useModelPapers,
  usePastPapers,
  useSubjectPapers,
  usePracticePapers,
  
  // Actions
  useUploadJsonMutation,

  // Query keys
  queryKeys: paperQueryKeys,
};

export default paperHooks;
