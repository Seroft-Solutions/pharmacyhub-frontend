import { apiClient } from '@/shared/api/apiClient';
import { 
  Exam, 
  Question, 
  ExamAttempt, 
  UserAnswer, 
  ExamResult,
  FlaggedQuestion,
  ExamStats
} from '../model/mcqTypes';

const BASE_PATH = '/api/v1/exams';

export const examApi = {
  /**
   * Get all exams
   */
  getAllExams: async (): Promise<Exam[]> => {
    const response = await apiClient.get<Exam[]>(BASE_PATH);
    if (response.error) throw response.error;
    return response.data || [];
  },

  /**
   * Get all published exams
   */
  getPublishedExams: async (): Promise<Exam[]> => {
    const response = await apiClient.get<Exam[]>(`${BASE_PATH}/published`);
    if (response.error) throw response.error;
    return response.data || [];
  },

  /**
   * Get exams by status
   */
  getExamsByStatus: async (status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'): Promise<Exam[]> => {
    const response = await apiClient.get<Exam[]>(`${BASE_PATH}/status/${status}`);
    if (response.error) throw response.error;
    return response.data || [];
  },

  /**
   * Get exam by id
   */
  getExamById: async (examId: number): Promise<Exam> => {
    const response = await apiClient.get<Exam>(`${BASE_PATH}/${examId}`);
    if (response.error) throw response.error;
    if (!response.data) throw new Error('Exam not found');
    return response.data;
  },

  /**
   * Get exam questions
   */
  getExamQuestions: async (examId: number): Promise<Question[]> => {
    const response = await apiClient.get<Question[]>(`${BASE_PATH}/${examId}/questions`);
    if (response.error) throw response.error;
    return response.data || [];
  },

  /**
   * Start an exam attempt
   */
  startExam: async (examId: number, userId: string): Promise<ExamAttempt> => {
    const response = await apiClient.post<ExamAttempt>(
      `${BASE_PATH}/${examId}/start`,
      { userId }
    );
    if (response.error) throw response.error;
    if (!response.data) throw new Error('Failed to start exam');
    return response.data;
  },

  /**
   * Submit a single answer
   */
  saveAnswer: async (attemptId: number, answer: UserAnswer): Promise<ExamAttempt> => {
    const response = await apiClient.post<ExamAttempt>(
      `${BASE_PATH}/attempts/${attemptId}/answers`,
      answer
    );
    if (response.error) throw response.error;
    if (!response.data) throw new Error('Failed to save answer');
    return response.data;
  },

  /**
   * Submit all exam answers
   */
  submitExam: async (attemptId: number, answers: UserAnswer[]): Promise<ExamResult> => {
    const response = await apiClient.post<ExamResult>(
      `${BASE_PATH}/attempts/${attemptId}/submit`,
      { answers }
    );
    if (response.error) throw response.error;
    if (!response.data) throw new Error('Failed to submit exam');
    return response.data;
  },

  /**
   * Get exam result
   */
  getExamResult: async (attemptId: number): Promise<ExamResult> => {
    const response = await apiClient.get<ExamResult>(`${BASE_PATH}/attempts/${attemptId}/result`);
    if (response.error) throw response.error;
    if (!response.data) throw new Error('Exam result not found');
    return response.data;
  },

  /**
   * Get user's exam attempts
   */
  getUserAttempts: async (userId: string): Promise<ExamAttempt[]> => {
    const response = await apiClient.get<ExamAttempt[]>(`${BASE_PATH}/attempts/user/${userId}`);
    if (response.error) throw response.error;
    return response.data || [];
  },

  /**
   * Get attempts for a specific exam by a user
   */
  getExamAttemptsByUser: async (examId: number, userId: string): Promise<ExamAttempt[]> => {
    const response = await apiClient.get<ExamAttempt[]>(
      `${BASE_PATH}/${examId}/attempts?userId=${userId}`
    );
    if (response.error) throw response.error;
    return response.data || [];
  },

  /**
   * Flag a question for review
   */
  flagQuestion: async (attemptId: number, questionId: number): Promise<ExamAttempt> => {
    const response = await apiClient.post<ExamAttempt>(
      `${BASE_PATH}/attempts/${attemptId}/flag`,
      { questionId }
    );
    if (response.error) throw response.error;
    if (!response.data) throw new Error('Failed to flag question');
    return response.data;
  },

  /**
   * Unflag a question
   */
  unflagQuestion: async (attemptId: number, questionId: number): Promise<ExamAttempt> => {
    const response = await apiClient.post<ExamAttempt>(
      `${BASE_PATH}/attempts/${attemptId}/unflag`,
      { questionId }
    );
    if (response.error) throw response.error;
    if (!response.data) throw new Error('Failed to unflag question');
    return response.data;
  },

  /**
   * Get flagged questions for an attempt
   */
  getFlaggedQuestions: async (attemptId: number): Promise<FlaggedQuestion[]> => {
    const response = await apiClient.get<FlaggedQuestion[]>(
      `${BASE_PATH}/attempts/${attemptId}/flagged`
    );
    if (response.error) throw response.error;
    return response.data || [];
  },

  /**
   * Get exam statistics
   */
  getExamStats: async (): Promise<ExamStats> => {
    const response = await apiClient.get<ExamStats>(`${BASE_PATH}/stats`);
    if (response.error) throw response.error;
    if (!response.data) throw new Error('Failed to get exam statistics');
    return response.data;
  }
};
