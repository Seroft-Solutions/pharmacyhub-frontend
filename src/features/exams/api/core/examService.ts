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
  ExamStats
} from '../../model/standardTypes';

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
  
  // Model paper endpoints (using exams with tags filtering)
  getModelPapers: '/api/v1/exams/papers/model',
  getPastPapers: '/api/v1/exams/papers/past'
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
    const response = await apiClient.get<Exam[]>(examEndpoints.getPublishedExams);
    return response.data;
  },
  
  /**
   * Get exam by ID
   */
  async getExamById(examId: number): Promise<Exam> {
    const response = await apiClient.get<Exam>(examEndpoints.getExamById(examId));
    return response.data;
  },
  
  /**
   * Get model papers (exams with model tag)
   */
  async getModelPapers(): Promise<Exam[]> {
    const response = await apiClient.get<Exam[]>(examEndpoints.getModelPapers);
    return response.data;
  },
  
  /**
   * Get past papers (exams with past tag)
   */
  async getPastPapers(): Promise<Exam[]> {
    const response = await apiClient.get<Exam[]>(examEndpoints.getPastPapers);
    return response.data;
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
  }
};