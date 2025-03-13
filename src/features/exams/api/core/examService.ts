/**
 * Exam service API endpoints
 * 
 * This module provides the API endpoints for exams feature that can be used
 * with the tanstack-query-api hooks.
 */

import { apiClient } from '@/features/tanstack-query-api';
import {
  Exam,
  ExamAttempt,
  UserAnswer,
  ExamResult,
  FlaggedQuestion,
  ExamStats,
  Question
} from '../../types/StandardTypes';

// Define API endpoints
export const examEndpoints = {
  // Read endpoints
  getAllExams: '/api/v1/exams',
  getPublishedExams: '/api/v1/exams/published',
  getExamById: (id: number) => `/api/v1/exams/${id}`,
  getExamsByStatus: (status: string) => `/api/v1/exams/status/${status}`,
  getExamQuestions: (examId: number) => `/api/v1/exams/${examId}/questions`,
  getUserExamAttempts: () => `/api/v1/exams/attempts/user`,
  getUserExamAttemptsForExam: (examId: number) => `/api/v1/exams/${examId}/attempts`,
  getExamAttempt: (attemptId: number) => `/api/v1/exams/attempts/${attemptId}`,
  getExamResult: (attemptId: number) => `/api/v1/exams/attempts/${attemptId}/result`,
  getFlaggedQuestions: (attemptId: number) => `/api/v1/exams/attempts/${attemptId}/flags`,
  getExamStats: '/api/v1/exams/stats', // Updated endpoint
  
  // Mutation endpoints
  startExam: (examId: number) => `/api/v1/exams/${examId}/start`,
  answerQuestion: (examId: number, questionId: number) => `/api/v1/exams/attempts/${examId}/answer/${questionId}`,
  flagQuestion: (attemptId: number, questionId: number) => `/api/v1/exams/attempts/${attemptId}/flag/${questionId}`,
  unflagQuestion: (attemptId: number, questionId: number) => `/api/v1/exams/attempts/${attemptId}/flag/${questionId}`,
  submitExam: (attemptId: number) => `/api/v1/exams/attempts/${attemptId}/submit`,
  publishExam: (examId: number) => `/api/v1/exams/${examId}/publish`,
  archiveExam: (examId: number) => `/api/v1/exams/${examId}/archive`,
  updateQuestion: (examId: number, questionId: number) => `/api/v1/exams/${examId}/questions/${questionId}`,
  
  // Model paper endpoints (using exams with tags filtering)
  getModelPapers: '/api/v1/exams/papers/model',
  getPastPapers: '/api/v1/exams/papers/past',
  getSubjectPapers: '/api/v1/exams/papers/subject',
  getPracticePapers: '/api/v1/exams/papers/practice'
};

/**
 * Direct service implementation for use with Zustand store
 * This allows direct API calls for cases where hooks are not appropriate
 */
export const examService = {
  /**
   * Get all published exams
   */
  async getPublishedExams(): Promise<Exam[]> {
    try {
      const response = await apiClient.get<{ data: Exam[] }>(examEndpoints.getPublishedExams);
      return response?.data?.data || [];
    } catch (error) {
      console.error('Error fetching published exams:', error);
      return [];
    }
  },
  
  /**
   * Get exam by ID
   */
  async getExamById(examId: number): Promise<Exam> {
    try {
      const response = await apiClient.get<{ data: Exam }>(examEndpoints.getExamById(examId));
      return response?.data?.data;
    } catch (error) {
      console.error(`Error fetching exam ${examId}:`, error);
      throw error;
    }
  },
  
  /**
   * Get model papers (exams with model tag)
   */
  async getModelPapers(): Promise<Exam[]> {
    try {
      const response = await apiClient.get<{ data: Exam[] }>(examEndpoints.getModelPapers);
      return response?.data?.data || [];
    } catch (error) {
      console.error('Error fetching model papers:', error);
      return [];
    }
  },
  
  /**
   * Get past papers (exams with past tag)
   */
  async getPastPapers(): Promise<Exam[]> {
    try {
      const response = await apiClient.get<{ data: Exam[] }>(examEndpoints.getPastPapers);
      return response?.data?.data || [];
    } catch (error) {
      console.error('Error fetching past papers:', error);
      return [];
    }
  },
  
  /**
   * Get subject papers (exams with subject tag)
   */
  async getSubjectPapers(): Promise<Exam[]> {
    try {
      const response = await apiClient.get<{ data: Exam[] }>(examEndpoints.getSubjectPapers);
      return response?.data?.data || [];
    } catch (error) {
      console.error('Error fetching subject papers:', error);
      return [];
    }
  },
  
  /**
   * Get practice papers (exams with practice tag)
   */
  async getPracticePapers(): Promise<Exam[]> {
    try {
      const response = await apiClient.get<{ data: Exam[] }>(examEndpoints.getPracticePapers);
      return response?.data?.data || [];
    } catch (error) {
      console.error('Error fetching practice papers:', error);
      return [];
    }
  },
  
  /**
   * Get exam statistics
   */
  async getExamStats(): Promise<ExamStats> {
    const response = await apiClient.get<ExamStats>(examEndpoints.getExamStats);
    return response.data;
  },
  
  /**
   * Start a new exam attempt
   */
  async startExam(examId: number): Promise<ExamAttempt> {
    const response = await apiClient.post<ExamAttempt>(examEndpoints.startExam(examId));
    return response.data;
  },
  
  /**
   * Get flagged questions for an attempt
   */
  async getFlaggedQuestions(attemptId: number): Promise<FlaggedQuestion[]> {
    const response = await apiClient.get<FlaggedQuestion[]>(examEndpoints.getFlaggedQuestions(attemptId));
    return response.data;
  },
  
  /**
   * Flag a question in an attempt
   */
  async flagQuestion(attemptId: number, questionId: number): Promise<void> {
    await apiClient.post(examEndpoints.flagQuestion(attemptId, questionId));
  },
  
  /**
   * Unflag a question in an attempt
   */
  async unflagQuestion(attemptId: number, questionId: number): Promise<void> {
    await apiClient.delete(examEndpoints.unflagQuestion(attemptId, questionId));
  },
  
  /**
   * Submit an exam with user answers
   */
  async submitExam(attemptId: number, answers: UserAnswer[]): Promise<ExamResult> {
    const response = await apiClient.post<ExamResult>(
      examEndpoints.submitExam(attemptId),
      { answers }
    );
    return response.data;
  },
  
  /**
   * Update a question in an exam
   */
  async updateQuestion(examId: number, questionId: number, questionData: Question): Promise<Question> {
    const response = await apiClient.put<Question>(
      examEndpoints.updateQuestion(examId, questionId),
      questionData
    );
    return response.data;
  }
};