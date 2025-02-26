import { useApiQuery, useApiMutation, useApiPaginatedQuery } from '@/shared/api/hook/useApi';
import { Exam, ExamStatus, ExamAttempt, UserAnswer, ExamResult } from '../model/mcqTypes';
import { adaptBackendExam, BackendExam } from '../api/adapter';

const BASE_PATH = '/exams';

interface ExamsResponse {
  exams: BackendExam[];
}

/**
 * Hook for fetching all exams
 */
export function useExams() {
  return useApiQuery<ExamsResponse, Exam[]>(
    ['exams'],
    BASE_PATH,
    {
      select: (data) => data.exams.map(adaptBackendExam)
    }
  );
}

/**
 * Hook for fetching published exams
 */
export function usePublishedExams() {
  return useApiQuery<ExamsResponse, Exam[]>(
    ['exams', 'published'],
    `${BASE_PATH}/published`,
    {
      select: (data) => data.exams.map(adaptBackendExam)
    }
  );
}

/**
 * Hook for fetching a single exam by ID
 */
export function useExam(id: number) {
  return useApiQuery<{ exam: BackendExam }, Exam>(
    ['exams', id],
    `${BASE_PATH}/${id}`,
    {
      select: (data) => adaptBackendExam(data.exam),
      enabled: Boolean(id)
    }
  );
}

interface StartExamVariables {
  examId: number;
}

/**
 * Hook for starting an exam
 */
export function useStartExam() {
  return useApiMutation<ExamAttempt, StartExamVariables>(
    `${BASE_PATH}/start`,
    {
      onError: (error) => {
        console.error('Failed to start exam:', error);
      }
    }
  );
}

interface SubmitExamVariables {
  attemptId: number;
  answers: UserAnswer[];
}

/**
 * Hook for submitting an exam attempt
 */
export function useSubmitExam() {
  return useApiMutation<ExamResult, SubmitExamVariables>(
    `${BASE_PATH}/attempts/submit`,
    {
      onError: (error) => {
        console.error('Failed to submit exam:', error);
      }
    }
  );
}

interface ExamListParams {
  page: number;
  pageSize: number;
  status?: ExamStatus;
}

interface PaginatedExamsResponse {
  exams: BackendExam[];
  totalPages: number;
  totalItems: number;
}

/**
 * Hook for fetching paginated exams with optional status filter
 */
export function useExamsList({ page, pageSize, status }: ExamListParams) {
  const endpoint = status 
    ? `${BASE_PATH}/status/${status}` 
    : BASE_PATH;

  return useApiPaginatedQuery<PaginatedExamsResponse, {
    exams: Exam[];
    totalPages: number;
    totalItems: number;
  }>(
    ['exams', 'list', status ?? 'all'],
    endpoint,
    { page, pageSize },
    {
      select: (data) => ({
        exams: data.exams.map(adaptBackendExam),
        totalPages: data.totalPages,
        totalItems: data.totalItems
      })
    }
  );
}

// Export types for convenience
export type { 
  Exam,
  ExamStatus,
  ExamAttempt,
  UserAnswer,
  ExamResult,
  StartExamVariables,
  SubmitExamVariables,
  ExamListParams,
  PaginatedExamsResponse
};