import { apiClient } from '@/shared/api/apiClient';
import { Exam, Question, ExamAttempt, UserAnswer, ExamResult } from '../model/mcqTypes';

const BASE_PATH = '/exams';

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
  startExam: async (examId: number, userId: number): Promise<ExamAttempt> => {
    const response = await apiClient.post<ExamAttempt>(
      `${BASE_PATH}/${examId}/start`,
      { userId }
    );
    if (response.error) throw response.error;
    if (!response.data) throw new Error('Failed to start exam');
    return response.data;
  },

  /**
   * Submit exam answers
   */
  submitExam: async (
    examId: number,
    userId: number,
    answers: UserAnswer[]
  ): Promise<ExamResult> => {
    const response = await apiClient.post<ExamResult>(
      `${BASE_PATH}/${examId}/submit`,
      { userId, answers }
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
  }
};
