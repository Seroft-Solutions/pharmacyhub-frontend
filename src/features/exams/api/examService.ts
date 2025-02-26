import { Exam, ExamStatus, ExamAttempt, UserAnswer, ExamResult } from '../model/mcqTypes';
import { logger } from '@/shared/lib/logger';
import { adaptBackendExam, BackendExam } from './adapter';
import { apiClient } from '@/shared/api';

const BASE_PATH = '/exams';

/**
 * Service for handling exam-related API operations
 */
export const examService = {
  // Get all exams
  async getAllExams(): Promise<Exam[]> {
    try {
      logger.info('Fetching all exams');
      
      const response = await apiClient.get<BackendExam[]>(BASE_PATH);
      
      if (response.error) {
        throw response.error;
      }

      const exams = (response.data || []).map(adaptBackendExam);
      logger.info('Successfully fetched all exams', { count: exams.length });
      
      return exams;
    } catch (error) {
      logger.error('Failed to fetch all exams', {
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      throw error;
    }
  },

  // Get published exams only
  async getPublishedExams(): Promise<Exam[]> {
    try {
      logger.info('Fetching published exams');

      const response = await apiClient.get<BackendExam[]>(`${BASE_PATH}/published`);
      
      if (response.error) {
        throw response.error;
      }

      const exams = (response.data || []).map(adaptBackendExam);
      logger.info('Successfully fetched published exams', { count: exams.length });
      
      return exams;
    } catch (error) {
      logger.error('Failed to fetch published exams', {
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      throw error;
    }
  },

  // Get exam by ID
  async getExamById(id: number): Promise<Exam> {
    try {
      logger.info('Fetching exam by ID', { examId: id });

      const response = await apiClient.get<BackendExam>(`${BASE_PATH}/${id}`);
      
      if (response.error) {
        throw response.error;
      }

      if (!response.data) {
        throw new Error(`Exam with ID ${id} not found`);
      }

      return adaptBackendExam(response.data);
    } catch (error) {
      logger.error(`Failed to fetch exam with ID ${id}`, {
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      throw error;
    }
  },

  // Start an exam attempt
  async startExam(examId: number): Promise<ExamAttempt> {
    try {
      logger.info('Starting exam attempt', { examId });

      const response = await apiClient.post<ExamAttempt>(`${BASE_PATH}/${examId}/start`);
      
      if (response.error) {
        throw response.error;
      }

      if (!response.data) {
        throw new Error('Failed to start exam attempt');
      }

      return response.data;
    } catch (error) {
      logger.error(`Failed to start exam with ID ${examId}`, {
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      throw error;
    }
  },

  // Submit an exam attempt
  async submitExam(attemptId: number, answers: UserAnswer[]): Promise<ExamResult> {
    try {
      logger.info('Submitting exam attempt', { attemptId, answersCount: answers.length });

      const response = await apiClient.post<ExamResult>(
        `${BASE_PATH}/attempts/${attemptId}/submit`,
        { answers }
      );
      
      if (response.error) {
        throw response.error;
      }

      if (!response.data) {
        throw new Error('Failed to submit exam attempt');
      }

      return response.data;
    } catch (error) {
      logger.error('Failed to submit exam attempt', {
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      throw error;
    }
  },

  // Get exams by status
  async getExamsByStatus(status: ExamStatus): Promise<Exam[]> {
    try {
      logger.info('Fetching exams by status', { status });

      const response = await apiClient.get<BackendExam[]>(`${BASE_PATH}/status/${status}`);
      
      if (response.error) {
        throw response.error;
      }

      const exams = (response.data || []).map(adaptBackendExam);
      return exams;
    } catch (error) {
      logger.error(`Failed to fetch exams with status ${status}`, {
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      throw error;
    }
  }
};

export default examService;
