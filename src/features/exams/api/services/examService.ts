/**
 * Exam Service Implementation
 * 
 * This module provides implementation for exam service functions
 * used by the mcqExamStore and other components.
 */

import { apiClient } from '@/shared/api/client';
import { examEndpoints } from '../core/examService';
import { 
  Exam, 
  ExamAttempt, 
  UserAnswer, 
  ExamResult, 
  FlaggedQuestion 
} from '../../model/mcqTypes';

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
