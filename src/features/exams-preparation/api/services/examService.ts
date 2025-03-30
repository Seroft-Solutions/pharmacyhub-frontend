/**
 * Exam Service
 * 
 * This service provides methods for interacting with the exam-related API endpoints.
 */

import { apiClient } from '@/core/api';
import { API_ENDPOINTS } from '../constants';
import { 
  Exam, 
  Question, 
  ExamAttempt, 
  ExamResult, 
  ExamAnswer 
} from '../../types/models/exam';

// Type for exam query parameters
export interface ExamQueryParams {
  page?: number;
  pageSize?: number;
  search?: string;
  difficulty?: string;
  isPremium?: boolean;
}

/**
 * Service for exam-related API calls
 */
export const examService = {
  /**
   * Get all exams with optional filtering
   */
  async getExams(params: ExamQueryParams = {}): Promise<Exam[]> {
    const { data } = await apiClient.get(API_ENDPOINTS.EXAMS, { params });
    return data;
  },
  
  /**
   * Get only published exams
   */
  async getPublishedExams(params: ExamQueryParams = {}): Promise<Exam[]> {
    const { data } = await apiClient.get(API_ENDPOINTS.EXAMS_PUBLISHED, { params });
    return data;
  },
  
  /**
   * Get a specific exam by ID
   */
  async getExamById(id: number): Promise<Exam> {
    const { data } = await apiClient.get(API_ENDPOINTS.EXAM_BY_ID(id));
    return data;
  },
  
  /**
   * Get questions for a specific exam
   */
  async getExamQuestions(examId: number): Promise<Question[]> {
    const { data } = await apiClient.get(API_ENDPOINTS.QUESTIONS(examId));
    return data;
  },
  
  /**
   * Start a new exam attempt
   */
  async startExam(examId: number): Promise<ExamAttempt> {
    const { data } = await apiClient.post(API_ENDPOINTS.START_ATTEMPT(examId));
    return data;
  },
  
  /**
   * Get an attempt by ID
   */
  async getAttemptById(attemptId: string): Promise<ExamAttempt> {
    const { data } = await apiClient.get(API_ENDPOINTS.ATTEMPT_BY_ID(attemptId));
    return data;
  },
  
  /**
   * Answer a question in an exam attempt
   */
  async answerQuestion(
    attemptId: string, 
    questionId: number, 
    answer: string | string[]
  ): Promise<void> {
    const payload = {
      selectedOptions: Array.isArray(answer) ? answer : [answer],
    };
    
    await apiClient.post(
      API_ENDPOINTS.ANSWER_QUESTION(attemptId, questionId),
      payload
    );
  },
  
  /**
   * Flag a question for review
   */
  async flagQuestion(attemptId: string, questionId: number): Promise<void> {
    await apiClient.post(API_ENDPOINTS.FLAG_QUESTION(attemptId, questionId));
  },
  
  /**
   * Unflag a question
   */
  async unflagQuestion(attemptId: string, questionId: number): Promise<void> {
    await apiClient.delete(API_ENDPOINTS.FLAG_QUESTION(attemptId, questionId));
  },
  
  /**
   * Complete an exam attempt
   */
  async completeAttempt(attemptId: string): Promise<void> {
    await apiClient.post(API_ENDPOINTS.SUBMIT_ATTEMPT(attemptId));
  },
  
  /**
   * Get all active attempts for the current user
   */
  async getActiveAttempts(): Promise<ExamAttempt[]> {
    const { data } = await apiClient.get(API_ENDPOINTS.ATTEMPTS, {
      params: { status: 'IN_PROGRESS' }
    });
    return data;
  },
  
  /**
   * Get result for a specific attempt
   */
  async getResultByAttemptId(attemptId: string): Promise<ExamResult> {
    const { data } = await apiClient.get(API_ENDPOINTS.RESULT_BY_ATTEMPT(attemptId));
    return data;
  },
  
  /**
   * Get all results for a specific exam
   */
  async getResultsByExamId(examId: number): Promise<ExamResult[]> {
    const { data } = await apiClient.get(API_ENDPOINTS.RESULTS, {
      params: { examId }
    });
    return data;
  },
  
  /**
   * Get all results for the current user
   */
  async getUserResults(): Promise<ExamResult[]> {
    const { data } = await apiClient.get(API_ENDPOINTS.RESULTS);
    return data;
  },
};
