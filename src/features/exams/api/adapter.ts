/**
 * Exam Service Adapter
 * 
 * This adapter bridges the direct API style with the TanStack Query API
 * to ensure all API calls follow the project standard.
 */
import { apiClient } from '@/features/tanstack-query-api/core/apiClient';
import { examEndpoints } from './core/examService';
import { 
  Exam, 
  Question, 
  ExamAttempt, 
  UserAnswer, 
  ExamResult, 
  FlaggedQuestion, 
  ExamPaper 
} from '../types/StandardTypes';

/**
 * Exam Service implementation using the TanStack Query API
 * 
 * This service should be used by components that cannot use React Query hooks
 * directly (e.g., non-React code, Zustand stores).
 */
export const examServiceAdapter = {
  /**
   * Get all published exams
   */
  async getPublishedExams(): Promise<Exam[]> {
    const response = await apiClient.get<Exam[]>(examEndpoints.getPublishedExams);
    return response.data || [];
  },
  
  /**
   * Get exam by ID
   */
  async getExamById(examId: number): Promise<Exam> {
    const response = await apiClient.get<Exam>(examEndpoints.getExamById(examId));
    if (!response.data) {
      throw new Error(`Exam with ID ${examId} not found`);
    }
    return response.data;
  },
  
  /**
   * Get model papers
   */
  async getModelPapers(): Promise<ExamPaper[]> {
    const response = await apiClient.get<ExamPaper[]>(examEndpoints.getModelPapers);
    return response.data || [];
  },
  
  /**
   * Get past papers
   */
  async getPastPapers(): Promise<ExamPaper[]> {
    const response = await apiClient.get<ExamPaper[]>(examEndpoints.getPastPapers);
    return response.data || [];
  },
  
  /**
   * Get subject papers
   */
  async getSubjectPapers(): Promise<ExamPaper[]> {
    const response = await apiClient.get<ExamPaper[]>(examEndpoints.getSubjectPapers);
    return response.data || [];
  },
  
  /**
   * Get practice papers
   */
  async getPracticePapers(): Promise<ExamPaper[]> {
    const response = await apiClient.get<ExamPaper[]>(examEndpoints.getPracticePapers);
    return response.data || [];
  },
  
  /**
   * Start a new exam attempt
   */
  async startExam(examId: number): Promise<ExamAttempt> {
    const response = await apiClient.post<ExamAttempt>(examEndpoints.startExam(examId));
    if (!response.data) {
      throw new Error('Failed to start exam');
    }
    return response.data;
  },
  
  /**
   * Get flagged questions for an attempt
   */
  async getFlaggedQuestions(attemptId: number): Promise<FlaggedQuestion[]> {
    const response = await apiClient.get<FlaggedQuestion[]>(examEndpoints.getFlaggedQuestions(attemptId));
    return response.data || [];
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
    if (!response.data) {
      throw new Error('Failed to submit exam');
    }
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
    if (!response.data) {
      throw new Error('Failed to update question');
    }
    return response.data;
  }
};

// Export the adapter as the default examService for backward compatibility
export const examService = examServiceAdapter;
