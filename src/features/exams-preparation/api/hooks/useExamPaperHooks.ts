/**
 * Exam Paper Query Hooks
 * 
 * This module provides hooks for fetching and manipulating exam papers
 * using the core API module with proper error handling.
 */
import { useApiQuery, useApiMutation } from '@/core/api/hooks';
import { Paper } from '../../types';
import { paperKeys } from '../utils/queryKeys';
import { API_ENDPOINTS } from '../constants';
import { handleExamError } from '../utils/errorHandler';

/**
 * Hook for fetching all exam papers with optional filtering
 */
export const usePapers = (options = {}) => {
  return useApiQuery<Paper[]>(
    paperKeys.all(),
    API_ENDPOINTS.PAPERS,
    {
      onError: (error) => {
        // Use core error handling with exam-specific context
        handleExamError(error, { 
          action: 'fetch-papers',
          endpoint: API_ENDPOINTS.PAPERS
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
    API_ENDPOINTS.PAPER(paperId),
    {
      onError: (error) => {
        // Use core error handling with exam-specific context
        handleExamError(error, { 
          paperId,
          action: 'fetch-paper',
          endpoint: API_ENDPOINTS.PAPER(paperId)
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
    API_ENDPOINTS.MODEL_PAPERS,
    {
      onError: (error) => {
        // Use core error handling with exam-specific context
        handleExamError(error, { 
          action: 'fetch-model-papers',
          endpoint: API_ENDPOINTS.MODEL_PAPERS
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
    API_ENDPOINTS.PAST_PAPERS,
    {
      onError: (error) => {
        // Use core error handling with exam-specific context
        handleExamError(error, { 
          action: 'fetch-past-papers',
          endpoint: API_ENDPOINTS.PAST_PAPERS
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
    API_ENDPOINTS.SUBJECT_PAPERS,
    {
      onError: (error) => {
        // Use core error handling with exam-specific context
        handleExamError(error, { 
          action: 'fetch-subject-papers',
          endpoint: API_ENDPOINTS.SUBJECT_PAPERS
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
    API_ENDPOINTS.PRACTICE_PAPERS,
    {
      onError: (error) => {
        // Use core error handling with exam-specific context
        handleExamError(error, { 
          action: 'fetch-practice-papers',
          endpoint: API_ENDPOINTS.PRACTICE_PAPERS
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
    API_ENDPOINTS.PAPERS,
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
          endpoint: API_ENDPOINTS.PAPERS
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
    ({ id }) => API_ENDPOINTS.PAPER(id),
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
          endpoint: API_ENDPOINTS.PAPER(variables.id)
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
    (id) => API_ENDPOINTS.PAPER(id),
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
          endpoint: API_ENDPOINTS.PAPER(variables)
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
    API_ENDPOINTS.UPLOAD_JSON,
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
          endpoint: API_ENDPOINTS.UPLOAD_JSON
        });
      }
    }
  );
};
