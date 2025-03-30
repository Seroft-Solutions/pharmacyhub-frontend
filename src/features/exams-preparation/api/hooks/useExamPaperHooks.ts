/**
 * Exam Paper Query Hooks
 * 
 * This module provides hooks for fetching and manipulating exam papers
 * using the core API hooks factory.
 */
import { papersApiHooks } from '../services/apiHooksFactory';
import { Paper } from '../../types';

/**
 * Hook for fetching all exam papers with optional filtering
 */
export const usePapers = (options = {}) => {
  return papersApiHooks.useList<Paper[]>(undefined, options);
};

/**
 * Hook for fetching a specific paper by ID
 */
export const usePaper = (paperId: number, options = {}) => {
  return papersApiHooks.useDetail<Paper>(paperId, options);
};

/**
 * Hook for fetching model papers
 */
export const useModelPapers = (options = {}) => {
  return papersApiHooks.useCustomQuery<Paper[]>(
    'model',
    'model',
    options
  );
};

/**
 * Hook for fetching past papers
 */
export const usePastPapers = (options = {}) => {
  return papersApiHooks.useCustomQuery<Paper[]>(
    'past',
    'past',
    options
  );
};

/**
 * Hook for fetching subject papers
 */
export const useSubjectPapers = (options = {}) => {
  return papersApiHooks.useCustomQuery<Paper[]>(
    'subject',
    'subject',
    options
  );
};

/**
 * Hook for fetching practice papers
 */
export const usePracticePapers = (options = {}) => {
  return papersApiHooks.useCustomQuery<Paper[]>(
    'practice',
    'practice',
    options
  );
};

/**
 * Hook for creating a new paper
 */
export const useCreatePaper = () => {
  return papersApiHooks.useCreate<Paper, Partial<Paper>>();
};

/**
 * Hook for updating a paper
 */
export const useUpdatePaper = () => {
  return {
    mutate: (variables: { id: number; paper: Partial<Paper> }) => {
      const { id, paper } = variables;
      const updateHook = papersApiHooks.useUpdate(id);
      return updateHook.mutate(paper);
    },
    mutation: (id: number) => papersApiHooks.useUpdate(id)
  };
};

/**
 * Hook for deleting a paper
 */
export const useDeletePaper = () => {
  return papersApiHooks.useDelete<void, number>();
};

/**
 * Hook for uploading JSON exam papers
 */
export const useUploadJsonPaper = () => {
  return papersApiHooks.useAction<Paper, FormData>(
    papersApiHooks.queryKeys.custom('uploadJson'),
    {
      onSuccess: (_, __, context) => {
        // Invalidate all paper lists
        context?.queryClient.invalidateQueries({
          queryKey: papersApiHooks.queryKeys.lists()
        });
      }
    }
  );
};
