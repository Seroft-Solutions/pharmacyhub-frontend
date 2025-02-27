import { Exam, ExamStatus, ExamAttempt, UserAnswer, ExamResult } from '../model/mcqTypes';
import { logger } from '@/shared/lib/logger';
import { adaptBackendExam, BackendExam } from './adapter';
import { apiClient } from '@/shared/api';

// Updated path to match backend API controller
const BASE_PATH = '/api/v1/exams';

/**
 * Service for handling exam-related API operations
 */
export const examService = {
  /**
   * Get all exams
   */
  async getAllExams(): Promise<Exam[]> {
    try {
      console.log('Fetching all exams');
      
      const response = await apiClient.get<BackendExam[]>(BASE_PATH, {
        // Enable deduplication for better performance
        deduplicate: true
      });
      
      if (response.error) {
        console.error('Error response from API:', response.error);
        throw response.error;
      }

      const exams = (response.data || []).map(adaptBackendExam);
      console.log('Successfully fetched all exams', { count: exams.length });
      
      return exams;
    } catch (error) {
      console.error('Failed to fetch all exams', {
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      throw error;
    }
  },

  /**
   * Get published exams only - improved with better error handling
   */
  async getPublishedExams(): Promise<Exam[]> {
    try {
      console.log('Fetching published exams');

      // For debugging purposes, check if we have a token
      if (typeof window !== 'undefined') {
        const authToken = localStorage.getItem('auth_token');
        const accessToken = localStorage.getItem('access_token');
        
        console.log('Tokens available:', { 
          authToken: authToken ? 'yes' : 'no', 
          accessToken: accessToken ? 'yes' : 'no' 
        });
      }

      // Making an explicit public request without auth requirement
      const response = await apiClient.get<BackendExam[]>(`${BASE_PATH}/published`, {
        requiresAuth: false
      });
      
      if (response.error) {
        // For error debugging
        console.error('Error fetching published exams', {
          status: response.status,
          errorMessage: response.error.message,
          errorData: response.error.data
        });
        throw response.error;
      }

      const exams = (response.data || []).map(adaptBackendExam);
      console.log('Successfully fetched published exams', { count: exams.length });
      
      return exams;
    } catch (error) {
      // More detailed error logging
      console.error('Failed to fetch published exams', {
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      });
      throw error;
    }
  },

  /**
   * Get exam by ID
   */
  async getExamById(id: number): Promise<Exam> {
    try {
      console.log('Fetching exam by ID', { examId: id });

      const response = await apiClient.get<BackendExam>(`${BASE_PATH}/${id}`, {
        deduplicate: true
      });
      
      if (response.error) {
        console.error('Error response when fetching exam by ID:', response.error);
        throw response.error;
      }

      if (!response.data) {
        throw new Error(`Exam with ID ${id} not found`);
      }

      return adaptBackendExam(response.data);
    } catch (error) {
      console.error(`Failed to fetch exam with ID ${id}`, {
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      throw error;
    }
  },

  /**
   * Start an exam attempt
   */
  async startExam(examId: number): Promise<ExamAttempt> {
    try {
      console.log('Starting exam attempt', { examId });

      const response = await apiClient.post<ExamAttempt>(
        `${BASE_PATH}/${examId}/start`, 
        undefined,
        {
          deduplicate: false
        }
      );
      
      if (response.error) {
        console.error('Error starting exam:', response.error);
        throw response.error;
      }

      if (!response.data) {
        throw new Error('Failed to start exam attempt');
      }

      return response.data;
    } catch (error) {
      console.error(`Failed to start exam with ID ${examId}`, {
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      throw error;
    }
  },

  /**
   * Submit an exam attempt
   */
  async submitExam(attemptId: number, answers: UserAnswer[]): Promise<ExamResult> {
    try {
      console.log('Submitting exam attempt', { attemptId, answersCount: answers.length });

      // Validate answers before submission
      if (!answers || answers.length === 0) {
        throw new Error('Cannot submit an exam with no answers');
      }

      const response = await apiClient.post<ExamResult>(
        `${BASE_PATH}/attempts/${attemptId}/submit`,
        { answers },
        {
          deduplicate: false
        }
      );
      
      if (response.error) {
        console.error('Error submitting exam:', response.error);
        throw response.error;
      }

      if (!response.data) {
        throw new Error('Failed to submit exam attempt');
      }

      return response.data;
    } catch (error) {
      console.error('Failed to submit exam attempt', {
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      throw error;
    }
  },

  /**
   * Get exams by status
   */
  async getExamsByStatus(status: ExamStatus): Promise<Exam[]> {
    try {
      console.log('Fetching exams by status', { status });

      const response = await apiClient.get<BackendExam[]>(`${BASE_PATH}/status/${status}`, {
        deduplicate: true
      });
      
      if (response.error) {
        console.error('Error fetching exams by status:', response.error);
        throw response.error;
      }

      const exams = (response.data || []).map(adaptBackendExam);
      return exams;
    } catch (error) {
      console.error(`Failed to fetch exams with status ${status}`, {
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      throw error;
    }
  }
};

export default examService;
