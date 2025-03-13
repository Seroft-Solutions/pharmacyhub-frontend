import { apiClient } from '@/features/tanstack-query-api';
import { Exam } from '../../model/standardTypes';

// Define the API endpoints
export const jsonExamUploadEndpoints = {
  uploadJson: '/api/v1/exams/upload-json',
};

// Define the request interfaces
export interface JsonExamUploadRequest {
  title: string;
  description: string;
  duration: number;
  passingMarks?: number;
  status?: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  tags?: string[];
  jsonContent: string;
}

/**
 * Service for uploading JSON data to create exams
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
      const response = await apiClient.post<{ data: Exam, status: number }>(
        jsonExamUploadEndpoints.uploadJson, 
        data
      );
      if (response?.data?.data) {
        return response.data.data;
      }
      throw new Error('Invalid response format');
    } catch (error) {
      console.error('Error uploading JSON exam:', error);
      throw error;
    }
  },
};

export default jsonExamUploadService;