/**
 * Exams Query Hooks
 * 
 * This module provides hooks for fetching exam data using React Query.
 */

import { createQueryHook, createMutationHook } from './hookFactory';
import { examService } from '../services';
import { Exam } from '../../types/models/exam';
import { API_ENDPOINTS } from '../constants';
import { apiClient } from '@/core/api';

// Interfaces for query parameters
export interface ExamsQueryParams {
  page?: number;
  pageSize?: number;
  search?: string;
  difficulty?: string;
  isPremium?: boolean;
}

/**
 * Hook for fetching a list of exams with optional filtering
 */
export const useExams = createQueryHook<Exam[], ExamsQueryParams | void>(
  'exams',
  async (params = {}) => {
    return examService.getExams(params);
  },
  {
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 15 * 60 * 1000, // 15 minutes
  }
);

/**
 * Hook for fetching only published exams
 */
export const usePublishedExams = createQueryHook<Exam[], ExamsQueryParams | void>(
  'publishedExams',
  async (params = {}) => {
    return examService.getPublishedExams(params);
  },
  {
    staleTime: 5 * 60 * 1000, // 5 minutes
  }
);

/**
 * Hook for creating a new exam
 */
export const useCreateExam = createMutationHook<Exam, Omit<Exam, 'id'>>(
  async (examData) => {
    const { data } = await apiClient.post(API_ENDPOINTS.EXAMS, examData);
    return data;
  }
);

/**
 * Hook for updating an exam
 */
export const useUpdateExam = createMutationHook<Exam, { id: number; examData: Partial<Exam> }>(
  async ({ id, examData }) => {
    const { data } = await apiClient.put(API_ENDPOINTS.EXAM_BY_ID(id), examData);
    return data;
  }
);

/**
 * Hook for deleting an exam
 */
export const useDeleteExam = createMutationHook<void, number>(
  async (id) => {
    await apiClient.delete(API_ENDPOINTS.EXAM_BY_ID(id));
  }
);
