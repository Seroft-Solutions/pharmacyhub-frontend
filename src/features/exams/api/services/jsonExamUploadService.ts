/**
 * JSON Exam Upload Service
 * 
 * This service provides methods for uploading JSON exam files to the server.
 */
import { examApiService } from './examApiService';
import type { Exam, ExamPaper } from '../../types';

/**
 * Interface for JSON exam upload options
 */
export interface JsonUploadOptions {
  // Additional metadata to include with the upload
  metadata?: Record<string, any>;
  // Paper type (model, past, subject, practice)
  paperType?: string;
  // Tags for the exam
  tags?: string[];
}

/**
 * Service for handling JSON exam uploads
 */
export const jsonExamUploadService = {
  /**
   * Upload a JSON file to create an exam
   * 
   * @param jsonData The parsed JSON data to upload
   * @param options Additional options for the upload
   * @returns The created exam
   */
  uploadExamJson: async (jsonData: any, options?: JsonUploadOptions): Promise<Exam | null> => {
    // Prepare the upload data with metadata
    const uploadData = {
      ...jsonData,
      metadata: options?.metadata || {},
      paperType: options?.paperType || 'practice',
      tags: options?.tags || []
    };
    
    const response = await examApiService.uploadJson(uploadData);
    return response.data || null;
  },
  
  /**
   * Validate JSON data before uploading
   * 
   * @param jsonData The parsed JSON data to validate
   * @returns Validation result with errors if any
   */
  validateExamJson: (jsonData: any): { valid: boolean; errors: string[] } => {
    const errors: string[] = [];
    
    // Check if the JSON has the required structure
    if (!jsonData.title) {
      errors.push('Exam title is required');
    }
    
    if (!jsonData.questions || !Array.isArray(jsonData.questions) || jsonData.questions.length === 0) {
      errors.push('Exam must contain at least one question');
    } else {
      // Check that each question has the required structure
      jsonData.questions.forEach((question: any, index: number) => {
        if (!question.text) {
          errors.push(`Question ${index + 1} is missing text`);
        }
        
        if (!question.options || !Array.isArray(question.options) || question.options.length === 0) {
          errors.push(`Question ${index + 1} must have at least one option`);
        }
        
        if (question.correctOption === undefined || question.correctOption === null) {
          errors.push(`Question ${index + 1} is missing a correct option`);
        }
      });
    }
    
    return {
      valid: errors.length === 0,
      errors
    };
  }
};

export default jsonExamUploadService;
