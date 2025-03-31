/**
 * Exam Paper Hooks
 *
 * This module provides React hooks for interacting with exam paper-related APIs.
 * It leverages the createApiHooks factory from tanstack-query-api.
 */
import { createApiHooks } from '@/core/api/services/factories/createApiHooks';
import { useQueryClient } from '@tanstack/react-query';
import { PAPER_ENDPOINTS } from '../constants';
import { examQueryKeys } from './useExamApiHooks';
// Direct paper type determination instead of using a transformer
import type { ExamPaper } from '../../types';

/**
 * Utility function to process response data into paper format with correct paper type
 */
/**
 * Utility function to process response data into paper format with correct paper type
 * and sort them in ascending order by ID
 * @param exams - The exams data from API response
 * @param defaultType - The default paper type if not specified
 * @returns Array of ExamPaper objects sorted by ID in ascending order
 */
function processPaperResponse(exams: any, defaultType: string = 'PRACTICE'): ExamPaper[] {
  if (!exams) return [];
  
  // Handle case where exams are wrapped in an API response
  const examsArray = exams.data ? exams.data : (Array.isArray(exams) ? exams : []);
  
  // Map the exams array to ExamPaper objects
  const mappedExams = examsArray.map((exam: any) => ({
    id: exam.id,
    title: exam.title,
    description: exam.description,
    duration: exam.duration,
    totalMarks: exam.totalMarks || exam.totalmarks,
    passingMarks: exam.passingMarks || exam.passingmarks,
    status: exam.status,
    tags: exam.tags || [],
    paperType: defaultType,
    premium: exam.premium || false,
    price: exam.price || 0,
    purchased: exam.purchased || false,
    difficulty: exam.difficulty || 'MEDIUM',
    questionCount: exam.questionCount || (exam.questions ? exam.questions.length : 0),
    durationMinutes: exam.durationMinutes || exam.duration || 0,
    paymentStatus: exam.paymentStatus,
  }));
  
  // PHAR-176: Sort papers by ID in ascending order
  // Convert ID to number for proper numeric sorting
  return mappedExams.sort((a, b) => {
    const idA = typeof a.id === 'number' ? a.id : parseInt(a.id, 10);
    const idB = typeof b.id === 'number' ? b.id : parseInt(b.id, 10);
    return idA - idB;
  });
}

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
      select: (data) => processPaperResponse(data, 'MODEL')
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
      select: (data) => processPaperResponse(data, 'PAST')
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
      select: (data) => processPaperResponse(data, 'SUBJECT')
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
      select: (data) => processPaperResponse(data, 'PRACTICE')
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
