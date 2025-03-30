/**
 * Exam Paper Query Hooks
 * 
 * This module provides hooks for fetching and manipulating exam papers
 * using the core API module with proper error handling.
 */
import { useApiQuery, useApiMutation } from '@/core/api/hooks';
import { Paper } from '../../types';
import { paperKeys } from '../utils/queryKeys';
import { ENDPOINTS } from '../constants';
import { handleExamError } from '../utils/errorHandler';

/**
 * Hook for fetching all exam papers with optional filtering
 */
export const usePapers = (options = {}) => {
  return useApiQuery<Paper[]>(
    paperKeys.all(),
    ENDPOINTS.PAPERS.LIST,
    {
      onError: (error) => {
        // Use core error handling with exam-specific context
        handleExamError(error, { 
          action: 'fetch-papers',
          endpoint: ENDPOINTS.PAPERS.LIST
        });
      },
      ...options
    }
  );
};

/**
 * Hook for fetching a specific paper by ID
 */
export const usePaper = (paperId: number, options = {}) => {
  return useApiQuery<Paper>(
    paperKeys.detail(paperId),
    ENDPOINTS.PAPERS.DETAIL(paperId),
    {
      onError: (error) => {
        // Use core error handling with exam-specific context
        handleExamError(error, { 
          paperId,
          action: 'fetch-paper',
          endpoint: ENDPOINTS.PAPERS.DETAIL(paperId)
        });
      },
      ...options
    }
  );
};

/**
 * Hook for fetching model papers
 */
export const useModelPapers = (options = {}) => {
  return useApiQuery<Paper[]>(
    paperKeys.model(),
    ENDPOINTS.PAPERS.MODEL,
    {
      onError: (error) => {
        // Use core error handling with exam-specific context
        handleExamError(error, { 
          action: 'fetch-model-papers',
          endpoint: ENDPOINTS.PAPERS.MODEL
        });
      },
      ...options
    }
  );
};

/**
 * Hook for fetching past papers
 */
export const usePastPapers = (options = {}) => {
  return useApiQuery<Paper[]>(
    paperKeys.past(),
    ENDPOINTS.PAPERS.PAST,
    {
      onError: (error) => {
        // Use core error handling with exam-specific context
        handleExamError(error, { 
          action: 'fetch-past-papers',
          endpoint: ENDPOINTS.PAPERS.PAST
        });
      },
      ...options
    }
  );
};

/**
 * Hook for fetching subject papers
 */
export const useSubjectPapers = (options = {}) => {
  return useApiQuery<Paper[]>(
    paperKeys.subject(),
    ENDPOINTS.PAPERS.SUBJECT,
    {
      onError: (error) => {
        // Use core error handling with exam-specific context
        handleExamError(error, { 
          action: 'fetch-subject-papers',
          endpoint: ENDPOINTS.PAPERS.SUBJECT
        });
      },
      ...options
    }
  );
};

/**
 * Hook for fetching practice papers
 */
export const usePracticePapers = (options = {}) => {
  return useApiQuery<Paper[]>(
    paperKeys.practice(),
    ENDPOINTS.PAPERS.PRACTICE,
    {
      onError: (error) => {
        // Use core error handling with exam-specific context
        handleExamError(error, { 
          action: 'fetch-practice-papers',
          endpoint: ENDPOINTS.PAPERS.PRACTICE
        });
      },
      ...options
    }
  );
};

/**
 * Hook for creating a new paper
 */
export const useCreatePaper = () => {
  return useApiMutation<Paper, Partial<Paper>>(
    ENDPOINTS.PAPERS.CREATE,
    {
      onSuccess: (_, __, context) => {
        // Invalidate all paper queries
        context?.queryClient?.invalidateQueries({
          queryKey: paperKeys.all()
        });
      },
      onError: (error, variables) => {
        // Use core error handling with exam-specific context
        handleExamError(error, { 
          action: 'create-paper',
          endpoint: ENDPOINTS.PAPERS.CREATE
        });
      }
    }
  );
};

/**
 * Hook for updating a paper
 */
export const useUpdatePaper = () => {
  return useApiMutation<Paper, { id: number; paper: Partial<Paper> }>(
    ({ id }) => ENDPOINTS.PAPERS.UPDATE(id),
    {
      method: 'PUT',
      onSuccess: (data, variables, context) => {
        // Invalidate specific paper
        context?.queryClient?.invalidateQueries({
          queryKey: paperKeys.detail(variables.id)
        });
        
        // Invalidate paper lists
        context?.queryClient?.invalidateQueries({
          queryKey: paperKeys.all()
        });
      },
      onError: (error, variables) => {
        // Use core error handling with exam-specific context
        handleExamError(error, { 
          paperId: variables.id,
          action: 'update-paper',
          endpoint: ENDPOINTS.PAPERS.UPDATE(variables.id)
        });
      }
    }
  );
};

/**
 * Hook for deleting a paper
 */
export const useDeletePaper = () => {
  return useApiMutation<void, number>(
    (id) => ENDPOINTS.PAPERS.DELETE(id),
    {
      method: 'DELETE',
      onSuccess: (_, __, context) => {
        // Invalidate all paper lists
        context?.queryClient?.invalidateQueries({
          queryKey: paperKeys.all()
        });
      },
      onError: (error, variables) => {
        // Use core error handling with exam-specific context
        handleExamError(error, { 
          paperId: variables,
          action: 'delete-paper',
          endpoint: ENDPOINTS.PAPERS.DELETE(variables)
        });
      }
    }
  );
};

/**
 * Hook for uploading JSON exam papers
 */
export const useUploadJsonPaper = () => {
  return useApiMutation<Paper, FormData>(
    ENDPOINTS.PAPERS.UPLOAD_JSON,
    {
      onSuccess: (_, __, context) => {
        // Invalidate all paper lists
        context?.queryClient?.invalidateQueries({
          queryKey: paperKeys.all()
        });
      },
      onError: (error) => {
        // Use core error handling with exam-specific context
        handleExamError(error, { 
          action: 'upload-json-paper',
          endpoint: ENDPOINTS.PAPERS.UPLOAD_JSON
        });
      }
    }
  );
};
