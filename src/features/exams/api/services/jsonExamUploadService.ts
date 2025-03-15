import { apiClient } from '@/features/tanstack-query-api';
import { EXAM_ENDPOINTS } from '../constants';
import { Exam } from '../../types/StandardTypes';

// Define the request interfaces
export interface JsonExamUploadRequest {
  title: string;
  description: string;
  duration: number;
  passingMarks?: number;
  status?: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  tags?: string[];
  paperType?: string;
  metadata?: Record<string, any>;
  jsonContent: string;
}

/**
 * Service for uploading JSON data to create exams
 * 
 * Note: This service is maintained for backward compatibility.
 * New components should use the examHooks.useCreate mutation.
 */
export const jsonExamUploadService = {
  /**
   * Upload JSON data to create an exam
   * 
   * @param data The request data containing exam metadata and JSON content
   * @returns The created exam
   */
  async uploadJsonExam(data: JsonExamUploadRequest): Promise<Exam> {
    try {
      const endpoint = EXAM_ENDPOINTS.uploadJson || '/api/v1/exams/upload-json';
      const response = await apiClient.post<Exam>(endpoint, data);
      
      if (response.error) {
        throw response.error;
      }
      
      return response.data as Exam;
    } catch (error) {
      console.error('Error uploading JSON exam:', error);
      throw error;
    }
  },
};

export default jsonExamUploadService;