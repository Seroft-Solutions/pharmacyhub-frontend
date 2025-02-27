import { Exam, ExamStatusType, ExamAttempt, UserAnswer, ExamResult } from '../model/mcqTypes';
import { adaptBackendExam, BackendExam } from './adapter';
import { apiClient } from '@/shared/api';
import { tokenManager } from '@/shared/api/tokenManager';
import { TOKEN_CONFIG } from '@/shared/auth/apiConfig';

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
      // Always try to get stored token first
      const token = localStorage.getItem(TOKEN_CONFIG.ACCESS_TOKEN_KEY) || tokenManager.getToken();
      if (!token) {
        throw new Error('Authentication required');
      }

      const response = await apiClient.get<BackendExam[]>(BASE_PATH, {
        requiresAuth: true,
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.error) {
        throw response.error;
      }

      const exams = (response.data || []).map(adaptBackendExam);
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
      // First try without auth
      const response = await apiClient.get<BackendExam[]>(`${BASE_PATH}/published`, {
        requiresAuth: false
      });

      // If successful without auth, return the data
      if (!response.error) {
        return (response.data || []).map(adaptBackendExam);
      }

      // If we get here, try with auth
      const token = localStorage.getItem(TOKEN_CONFIG.ACCESS_TOKEN_KEY) || tokenManager.getToken();
      if (!token) {
        throw new Error('Unable to fetch exams: Authentication required');
      }

      const authResponse = await apiClient.get<BackendExam[]>(`${BASE_PATH}/published`, {
        requiresAuth: true,
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (authResponse.error) {
        throw authResponse.error;
      }

      return (authResponse.data || []).map(adaptBackendExam);
    } catch (error) {
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
      const token = localStorage.getItem(TOKEN_CONFIG.ACCESS_TOKEN_KEY) || tokenManager.getToken();
      if (!token) {
        throw new Error('Authentication required');
      }

      const response = await apiClient.get<BackendExam>(`${BASE_PATH}/${id}`, {
        requiresAuth: true,
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.error) {
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
      const token = localStorage.getItem(TOKEN_CONFIG.ACCESS_TOKEN_KEY) || tokenManager.getToken();
      if (!token) {
        throw new Error('Authentication required');
      }

      const response = await apiClient.post<ExamAttempt>(
        `${BASE_PATH}/${examId}/start`, 
        undefined,
        {
          requiresAuth: true,
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      if (response.error) {
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
      const token = localStorage.getItem(TOKEN_CONFIG.ACCESS_TOKEN_KEY) || tokenManager.getToken();
      if (!token) {
        throw new Error('Authentication required');
      }

      if (!answers || answers.length === 0) {
        throw new Error('Cannot submit an exam with no answers');
      }

      const response = await apiClient.post<ExamResult>(
        `${BASE_PATH}/attempts/${attemptId}/submit`,
        { answers },
        {
          requiresAuth: true,
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      if (response.error) {
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
  async getExamsByStatus(status: ExamStatusType): Promise<Exam[]> {
    try {
      const token = localStorage.getItem(TOKEN_CONFIG.ACCESS_TOKEN_KEY) || tokenManager.getToken();
      if (!token) {
        throw new Error('Authentication required');
      }

      const response = await apiClient.get<BackendExam[]>(`${BASE_PATH}/status/${status}`, {
        requiresAuth: true,
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.error) {
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
