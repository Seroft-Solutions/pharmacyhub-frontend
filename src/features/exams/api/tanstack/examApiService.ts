/**
 * Exam API Service
 * 
 * This module provides a service for interacting with the exam API endpoints
 * using the TanStack Query API client.
 */
import { createExtendedApiService, apiClient } from '@/features/tanstack-query-api';
import { adaptBackendExam } from '../adapter';
import type { 
  Exam, 
  Question, 
  ExamAttempt, 
  UserAnswer, 
  ExamResult,
  FlaggedQuestion,
  ExamStats
} from '../../model/mcqTypes';
import { ExamStatusType } from '../../types';

// Base endpoint for exam API
const BASE_PATH = '/api/v1/exams';

/**
 * Type for the extended API service methods
 */
interface ExamApiMethods {
  /**
   * Get all published exams
   */
  getPublishedExams: () => Promise<Exam[]>;
  
  /**
   * Get exams by status
   */
  getExamsByStatus: (status: ExamStatusType) => Promise<Exam[]>;
  
  /**
   * Get questions for a specific exam
   */
  getExamQuestions: (examId: number) => Promise<Question[]>;
  
  /**
   * Start an exam attempt
   */
  startExam: (examId: number) => Promise<ExamAttempt>;
  
  /**
   * Save a single answer in an exam attempt
   */
  saveAnswer: (attemptId: number, answer: UserAnswer) => Promise<ExamAttempt>;
  
  /**
   * Submit all exam answers and complete the attempt
   */
  submitExam: (attemptId: number, answers: UserAnswer[]) => Promise<ExamResult>;
  
  /**
   * Get exam result for a completed attempt
   */
  getExamResult: (attemptId: number) => Promise<ExamResult>;
  
  /**
   * Get all attempts by the current user
   */
  getUserAttempts: () => Promise<ExamAttempt[]>;
  
  /**
   * Get attempts for a specific exam by the current user
   */
  getExamAttemptsByUser: (examId: number) => Promise<ExamAttempt[]>;
  
  /**
   * Flag a question for review during an exam
   */
  flagQuestion: (attemptId: number, questionId: number) => Promise<ExamAttempt>;
  
  /**
   * Unflag a previously flagged question
   */
  unflagQuestion: (attemptId: number, questionId: number) => Promise<ExamAttempt>;
  
  /**
   * Get all flagged questions for an attempt
   */
  getFlaggedQuestions: (attemptId: number) => Promise<FlaggedQuestion[]>;
  
  /**
   * Get exam statistics
   */
  getExamStats: () => Promise<ExamStats>;
}

/**
 * API service for exam-related operations
 */
export const examApiService = createExtendedApiService<Exam, ExamApiMethods>(
  BASE_PATH,
  {
    getPublishedExams: async () => {
      const response = await apiClient.get<Exam[]>(`${BASE_PATH}/published`);
      if (response.error) throw response.error;
      return response.data || [];
    },
    
    getExamsByStatus: async (status: ExamStatusType) => {
      const response = await apiClient.get<Exam[]>(`${BASE_PATH}/status/${status}`);
      if (response.error) throw response.error;
      return response.data || [];
    },
    
    getExamQuestions: async (examId: number) => {
      const response = await apiClient.get<Question[]>(`${BASE_PATH}/${examId}/questions`);
      if (response.error) throw response.error;
      return response.data || [];
    },
    
    startExam: async (examId: number) => {
      const response = await apiClient.post<ExamAttempt>(`${BASE_PATH}/${examId}/start`);
      if (response.error) throw response.error;
      if (!response.data) throw new Error('Failed to start exam');
      return response.data;
    },
    
    saveAnswer: async (attemptId: number, answer: UserAnswer) => {
      const response = await apiClient.post<ExamAttempt>(
        `${BASE_PATH}/attempts/${attemptId}/answers`,
        answer
      );
      if (response.error) throw response.error;
      if (!response.data) throw new Error('Failed to save answer');
      return response.data;
    },
    
    submitExam: async (attemptId: number, answers: UserAnswer[]) => {
      const response = await apiClient.post<ExamResult>(
        `${BASE_PATH}/attempts/${attemptId}/submit`,
        { answers }
      );
      if (response.error) throw response.error;
      if (!response.data) throw new Error('Failed to submit exam');
      return response.data;
    },
    
    getExamResult: async (attemptId: number) => {
      const response = await apiClient.get<ExamResult>(
        `${BASE_PATH}/attempts/${attemptId}/result`
      );
      if (response.error) throw response.error;
      if (!response.data) throw new Error('Exam result not found');
      return response.data;
    },
    
    getUserAttempts: async () => {
      const response = await apiClient.get<ExamAttempt[]>(`${BASE_PATH}/attempts/user`);
      if (response.error) throw response.error;
      return response.data || [];
    },
    
    getExamAttemptsByUser: async (examId: number) => {
      const response = await apiClient.get<ExamAttempt[]>(
        `${BASE_PATH}/${examId}/attempts`
      );
      if (response.error) throw response.error;
      return response.data || [];
    },
    
    flagQuestion: async (attemptId: number, questionId: number) => {
      const response = await apiClient.post<ExamAttempt>(
        `${BASE_PATH}/attempts/${attemptId}/flag`,
        { questionId }
      );
      if (response.error) throw response.error;
      if (!response.data) throw new Error('Failed to flag question');
      return response.data;
    },
    
    unflagQuestion: async (attemptId: number, questionId: number) => {
      const response = await apiClient.post<ExamAttempt>(
        `${BASE_PATH}/attempts/${attemptId}/unflag`,
        { questionId }
      );
      if (response.error) throw response.error;
      if (!response.data) throw new Error('Failed to unflag question');
      return response.data;
    },
    
    getFlaggedQuestions: async (attemptId: number) => {
      const response = await apiClient.get<FlaggedQuestion[]>(
        `${BASE_PATH}/attempts/${attemptId}/flagged`
      );
      if (response.error) throw response.error;
      return response.data || [];
    },
    
    getExamStats: async () => {
      const response = await apiClient.get<ExamStats>(`${BASE_PATH}/stats`);
      if (response.error) throw response.error;
      if (!response.data) throw new Error('Failed to get exam statistics');
      return response.data;
    }
  }
);

export default examApiService;