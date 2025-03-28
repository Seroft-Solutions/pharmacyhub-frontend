/**
 * Example of using OpenAPI schema validation with TanStack Query API
 * 
 * NOTE: This is just an example file showing the integration pattern.
 * You would adapt this to your existing API hooks.
 */

import { useQuery, useMutation } from '@tanstack/react-query';
import { apiClient } from '../../core/app-api-handler'; // Your existing API client
import { apiSchemaHelpers, createValidator } from '@/features/core/app-api-handler/schema-helpers';
import { mapToBackendModel } from '@/features/core/app-api-schema/type-utilities';

// Import generated types from OpenAPI
import { 
  ExamResponseDTO, 
  ExamRequestDTO, 
  QuestionResponseDTO 
} from '@/features/core/app-api-schema/generated';

// Import your existing feature types
import { Exam, Question, CreateExamRequest } from '../types';

/**
 * Field mappings between frontend and backend types
 */
const examFieldMap = {
  text: 'questionText',
  label: 'optionKey',
  // Add other field mappings as needed
};

/**
 * Required fields for validation
 */
const requiredExamFields: (keyof ExamResponseDTO)[] = [
  'id', 'title', 'description', 'duration', 'totalMarks', 'passingMarks', 'status'
];

const requiredQuestionFields: (keyof QuestionResponseDTO)[] = [
  'id', 'questionNumber', 'text', 'options'
];

/**
 * Example API endpoint configuration
 */
export const EXAM_ENDPOINTS = {
  all: '/api/v1/exams',
  published: '/api/v1/exams/published',
  byId: '/api/v1/exams/:id',
  // Other endpoints...
};

/**
 * Hook to get all exams with type validation
 */
export function useExams() {
  return useQuery<ExamResponseDTO[]>({
    queryKey: ['exams'],
    queryFn: apiSchemaHelpers.createQueryFn<ExamResponseDTO[]>(
      EXAM_ENDPOINTS.all,
      requiredExamFields
    ),
  });
}

/**
 * Hook to get a specific exam with type validation
 */
export function useExam(id: number) {
  return useQuery<ExamResponseDTO>({
    queryKey: ['exam', id],
    queryFn: apiSchemaHelpers.createQueryFn<ExamResponseDTO>(
      EXAM_ENDPOINTS.byId.replace(':id', String(id)),
      requiredExamFields
    ),
    enabled: !!id,
  });
}

/**
 * Hook to create an exam with type validation
 */
export function useCreateExam() {
  return useMutation<ExamResponseDTO, Error, CreateExamRequest>({
    mutationFn: async (variables) => {
      // Convert from your frontend model to the backend DTO format
      const examDTO = mapToBackendModel<CreateExamRequest, ExamRequestDTO>(
        variables,
        examFieldMap
      );
      
      return apiSchemaHelpers.createMutationFn<ExamResponseDTO, ExamRequestDTO>(
        EXAM_ENDPOINTS.all,
        'POST',
        requiredExamFields
      )(examDTO);
    },
  });
}

/**
 * This is just an example file demonstrating how to integrate OpenAPI schema
 * validation with your existing TanStack Query API architecture. You would
 * adapt these patterns to your actual API hooks implementation.
 */
