/**
 * Exams API
 * 
 * This module provides the main API access for the exams-preparation feature.
 * It serves as a central point for accessing all API functionality.
 */
import { apiClient } from '@/core/api/core/apiClient';
import { handleApiError } from '@/core/api/core/error';
import { ENDPOINTS } from './constants';
import { 
  Exam, 
  ExamStatus, 
  Question, 
  ExamType, 
  ExamAttempt, 
  ExamResult 
} from '../types';

/**
 * Main API class for exams feature
 */
export class ExamsApi {
  /**
   * Base URL for exams API
   */
  private readonly baseUrl = '/v1/exams-preparation';
  
  /**
   * Get a list of exams with optional filtering
   */
  async getExams(params?: {
    page?: number;
    limit?: number;
    status?: ExamStatus;
    search?: string;
    sortBy?: string;
    sortDir?: 'asc' | 'desc';
  }): Promise<Exam[]> {
    try {
      const { data } = await apiClient.get(this.baseUrl, { params });
      return data;
    } catch (error) {
      throw handleApiError(error, { 
        context: { 
          feature: 'exams-preparation',
          action: 'getExams'
        }
      });
    }
  }
  
  /**
   * Get a specific exam by ID
   */
  async getExam(id: number): Promise<Exam> {
    try {
      const { data } = await apiClient.get(`${this.baseUrl}/${id}`);
      return data;
    } catch (error) {
      throw handleApiError(error, { 
        context: { 
          feature: 'exams-preparation',
          action: 'getExam',
          examId: id
        }
      });
    }
  }
  
  /**
   * Create a new exam
   */
  async createExam(exam: {
    title: string;
    description?: string;
    status?: ExamStatus;
    type?: ExamType;
    duration?: number;
    isPremium?: boolean;
    price?: number;
    [key: string]: any;
  }): Promise<Exam> {
    try {
      const { data } = await apiClient.post(this.baseUrl, exam);
      return data;
    } catch (error) {
      throw handleApiError(error, { 
        context: { 
          feature: 'exams-preparation',
          action: 'createExam'
        }
      });
    }
  }
  
  /**
   * Update an existing exam
   */
  async updateExam(id: number, exam: Partial<Exam>): Promise<Exam> {
    try {
      const { data } = await apiClient.put(`${this.baseUrl}/${id}`, exam);
      return data;
    } catch (error) {
      throw handleApiError(error, { 
        context: { 
          feature: 'exams-preparation',
          action: 'updateExam',
          examId: id
        }
      });
    }
  }
  
  /**
   * Delete an exam
   */
  async deleteExam(id: number): Promise<void> {
    try {
      await apiClient.delete(`${this.baseUrl}/${id}`);
    } catch (error) {
      throw handleApiError(error, { 
        context: { 
          feature: 'exams-preparation',
          action: 'deleteExam',
          examId: id
        }
      });
    }
  }
  
  /**
   * Publish an exam
   */
  async publishExam(id: number): Promise<Exam> {
    try {
      const { data } = await apiClient.post(`${this.baseUrl}/${id}/publish`);
      return data;
    } catch (error) {
      throw handleApiError(error, { 
        context: { 
          feature: 'exams-preparation',
          action: 'publishExam',
          examId: id
        }
      });
    }
  }
  
  /**
   * Archive an exam
   */
  async archiveExam(id: number): Promise<Exam> {
    try {
      const { data } = await apiClient.post(`${this.baseUrl}/${id}/archive`);
      return data;
    } catch (error) {
      throw handleApiError(error, { 
        context: { 
          feature: 'exams-preparation',
          action: 'archiveExam',
          examId: id
        }
      });
    }
  }
  
  /**
   * Get published exams
   */
  async getPublishedExams(params?: {
    page?: number;
    limit?: number;
  }): Promise<Exam[]> {
    try {
      const { data } = await apiClient.get(`${this.baseUrl}/published`, { params });
      return data;
    } catch (error) {
      throw handleApiError(error, { 
        context: { 
          feature: 'exams-preparation',
          action: 'getPublishedExams'
        }
      });
    }
  }
  
  /**
   * Get exams by status
   */
  async getExamsByStatus(
    status: ExamStatus,
    params?: {
      page?: number;
      limit?: number;
    }
  ): Promise<Exam[]> {
    try {
      const { data } = await apiClient.get(`${this.baseUrl}/status/${status}`, { params });
      return data;
    } catch (error) {
      throw handleApiError(error, { 
        context: { 
          feature: 'exams-preparation',
          action: 'getExamsByStatus',
          status
        }
      });
    }
  }
  
  /**
   * Get questions for an exam
   */
  async getExamQuestions(examId: number): Promise<Question[]> {
    try {
      const { data } = await apiClient.get(`${this.baseUrl}/${examId}/questions`);
      return data;
    } catch (error) {
      throw handleApiError(error, { 
        context: { 
          feature: 'exams-preparation',
          action: 'getExamQuestions',
          examId
        }
      });
    }
  }
  
  /**
   * Add a question to an exam
   */
  async addQuestion(examId: number, question: Omit<Question, 'id'>): Promise<Question> {
    try {
      const { data } = await apiClient.post(`${this.baseUrl}/${examId}/questions`, question);
      return data;
    } catch (error) {
      throw handleApiError(error, { 
        context: { 
          feature: 'exams-preparation',
          action: 'addQuestion',
          examId
        }
      });
    }
  }
  
  /**
   * Update a question
   */
  async updateQuestion(examId: number, questionId: number, question: Partial<Question>): Promise<Question> {
    try {
      const { data } = await apiClient.put(
        `${this.baseUrl}/${examId}/questions/${questionId}`,
        question
      );
      return data;
    } catch (error) {
      throw handleApiError(error, { 
        context: { 
          feature: 'exams-preparation',
          action: 'updateQuestion',
          examId,
          questionId
        }
      });
    }
  }
  
  /**
   * Delete a question
   */
  async deleteQuestion(examId: number, questionId: number): Promise<void> {
    try {
      await apiClient.delete(`${this.baseUrl}/${examId}/questions/${questionId}`);
    } catch (error) {
      throw handleApiError(error, { 
        context: { 
          feature: 'exams-preparation',
          action: 'deleteQuestion',
          examId,
          questionId
        }
      });
    }
  }
  
  /**
   * Start an exam attempt
   */
  async startExam(examId: number): Promise<ExamAttempt> {
    try {
      const { data } = await apiClient.post(`${this.baseUrl}/${examId}/start`);
      return data;
    } catch (error) {
      throw handleApiError(error, { 
        context: { 
          feature: 'exams-preparation',
          action: 'startExam',
          examId
        }
      });
    }
  }
  
  /**
   * Get an exam attempt
   */
  async getAttempt(attemptId: number): Promise<ExamAttempt> {
    try {
      const { data } = await apiClient.get(`${this.baseUrl}/attempts/${attemptId}`);
      return data;
    } catch (error) {
      throw handleApiError(error, { 
        context: { 
          feature: 'exams-preparation',
          action: 'getAttempt',
          attemptId
        }
      });
    }
  }
  
  /**
   * Get attempts for an exam
   */
  async getExamAttempts(examId: number): Promise<ExamAttempt[]> {
    try {
      const { data } = await apiClient.get(`${this.baseUrl}/${examId}/attempts`);
      return data;
    } catch (error) {
      throw handleApiError(error, { 
        context: { 
          feature: 'exams-preparation',
          action: 'getExamAttempts',
          examId
        }
      });
    }
  }
  
  /**
   * Submit an exam attempt
   */
  async submitExam(attemptId: number): Promise<ExamAttempt> {
    try {
      const { data } = await apiClient.post(`${this.baseUrl}/attempts/${attemptId}/submit`);
      return data;
    } catch (error) {
      throw handleApiError(error, { 
        context: { 
          feature: 'exams-preparation',
          action: 'submitExam',
          attemptId
        }
      });
    }
  }
  
  /**
   * Save an answer to a question
   */
  async saveAnswer(
    attemptId: number, 
    questionId: number, 
    answer: {
      answerId?: number;
      answerText?: string;
      selected?: boolean | string[];
      [key: string]: any;
    }
  ): Promise<any> {
    try {
      const { data } = await apiClient.post(
        `${this.baseUrl}/attempts/${attemptId}/answer/${questionId}`,
        answer
      );
      return data;
    } catch (error) {
      throw handleApiError(error, { 
        context: { 
          feature: 'exams-preparation',
          action: 'saveAnswer',
          attemptId,
          questionId
        }
      });
    }
  }
  
  /**
   * Flag a question in an attempt
   */
  async flagQuestion(
    attemptId: number, 
    questionId: number, 
    isFlagged: boolean
  ): Promise<any> {
    try {
      const { data } = await apiClient.post(
        `${this.baseUrl}/attempts/${attemptId}/flag/${questionId}`,
        { isFlagged }
      );
      return data;
    } catch (error) {
      throw handleApiError(error, { 
        context: { 
          feature: 'exams-preparation',
          action: 'flagQuestion',
          attemptId,
          questionId
        }
      });
    }
  }
  
  /**
   * Get exam result
   */
  async getExamResult(attemptId: number): Promise<ExamResult> {
    try {
      const { data } = await apiClient.get(`${this.baseUrl}/attempts/${attemptId}/result`);
      return data;
    } catch (error) {
      throw handleApiError(error, { 
        context: { 
          feature: 'exams-preparation',
          action: 'getExamResult',
          attemptId
        }
      });
    }
  }
}

/**
 * Singleton instance of ExamsApi
 */
export const examsApi = new ExamsApi();

export default examsApi;
