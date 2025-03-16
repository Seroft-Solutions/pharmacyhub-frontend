/**
 * Exam Store Adapter
 * 
 * This adapter bridges the gap between the Zustand store and the API services.
 * It provides a simplified interface for the store to interact with the API.
 */
import { examApiService } from './examApiService';
import type {
  Exam,
  ExamAttempt,
  Question,
  UserAnswer,
  ExamResult,
  FlaggedQuestion
} from '../../types';

/**
 * Simplified interface for the exam store
 */
export const examStoreAdapter = {
  // Exams
  getPublishedExams: async (): Promise<Exam[]> => {
    const response = await examApiService.getPublishedExams();
    const exams = response.data || [];
    
    // Handle both array and wrapped format
    return Array.isArray(exams) ? exams : (exams.data || []);
  },
  
  getExamById: async (examId: number): Promise<Exam | null> => {
    const response = await examApiService.getExamById(examId);
    console.log('Raw API response from getExamById:', response);
    
    // If no data, return null
    if (!response.data) return null;
    
    // Handle data wrapper if present
    return response.data.data || response.data;
  },
  
  // Questions
  getExamQuestions: async (examId: number): Promise<Question[]> => {
    const response = await examApiService.getExamQuestions(examId);
    const questions = response.data || [];
    
    // Handle both array and wrapped format
    return Array.isArray(questions) ? questions : (questions.data || []);
  },
  
  updateQuestion: async (examId: number, questionId: number, question: Partial<Question>): Promise<Question | null> => {
    const response = await examApiService.updateQuestion(examId, questionId, question);
    if (!response.data) return null;
    
    // Handle data wrapper if present
    return response.data.data || response.data;
  },
  
  deleteQuestion: async (examId: number, questionId: number): Promise<boolean> => {
    const response = await examApiService.deleteQuestion(examId, questionId);
    return !response.error;
  },
  
  // Attempts
  startExam: async (examId: number): Promise<ExamAttempt | null> => {
    const response = await examApiService.startExam(examId);
    return response.data || null;
  },
  
  getExamAttempt: async (attemptId: number): Promise<ExamAttempt | null> => {
    const response = await examApiService.getExamAttempt(attemptId);
    return response.data || null;
  },
  
  answerQuestion: async (attemptId: number, questionId: number, selectedOption: number): Promise<boolean> => {
    const response = await examApiService.answerQuestion(attemptId, questionId, selectedOption);
    return !response.error;
  },
  
  flagQuestion: async (attemptId: number, questionId: number): Promise<boolean> => {
    const response = await examApiService.flagQuestion(attemptId, questionId);
    return !response.error;
  },
  
  unflagQuestion: async (attemptId: number, questionId: number): Promise<boolean> => {
    const response = await examApiService.unflagQuestion(attemptId, questionId);
    return !response.error;
  },
  
  getFlaggedQuestions: async (attemptId: number): Promise<FlaggedQuestion[]> => {
    const response = await examApiService.getFlaggedQuestions(attemptId);
    return response.data || [];
  },
  
  submitExam: async (attemptId: number, answers?: UserAnswer[]): Promise<ExamResult | null> => {
    const response = await examApiService.submitExam(attemptId, answers);
    return response.data || null;
  },
  
  getExamResult: async (attemptId: number): Promise<ExamResult | null> => {
    const response = await examApiService.getExamResult(attemptId);
    return response.data || null;
  }
};

export default examStoreAdapter;
