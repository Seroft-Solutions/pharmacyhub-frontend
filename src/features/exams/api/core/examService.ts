import { 
  createExtendedApiService, 
  apiClient
} from '@/features/tanstack-query-api';

import { 
  Exam, 
  ExamStatusType, 
  ExamAttempt, 
  UserAnswer, 
  ExamResult, 
  FlaggedQuestion 
} from '../../model/mcqTypes';

import { adaptBackendExam, BackendExam } from '../adapter';

// Default API path
const BASE_PATH = '/api/v1/exams';

// Define custom methods for the exam service
const customMethods = {
  /**
   * Get all published exams
   */
  getPublishedExams: async () => {
    return apiClient.get<BackendExam[]>(`${BASE_PATH}/published`).then(response => {
      if (response.error) {
        throw response.error;
      }
      return (response.data || []).map(adaptBackendExam);
    });
  },

  /**
   * Get exam by ID
   */
  getExamById: async (examId: number) => {
    return apiClient.get<BackendExam>(`${BASE_PATH}/${examId}`).then(response => {
      if (response.error) {
        throw response.error;
      }
      return adaptBackendExam(response.data);
    });
  },

  /**
   * Get user's exam attempts
   */
  getUserAttempts: async (userId: string) => {
    return apiClient.get<ExamAttempt[]>(`${BASE_PATH}/user/${userId}/attempts`).then(response => {
      if (response.error) {
        throw response.error;
      }
      return response.data || [];
    });
  },

  /**
   * Get a specific attempt
   */
  getAttempt: async (attemptId: number) => {
    return apiClient.get<ExamAttempt>(`${BASE_PATH}/attempts/${attemptId}`).then(response => {
      if (response.error) {
        throw response.error;
      }
      return response.data;
    });
  },

  /**
   * Start an exam attempt
   */
  startExam: async (examId: number) => {
    return apiClient.post<ExamAttempt>(
      `${BASE_PATH}/${examId}/start`, 
      undefined
    ).then(response => {
      if (response.error) {
        throw response.error;
      }
      return response.data as ExamAttempt;
    });
  },

  /**
   * Submit an exam attempt
   */
  submitExam: async (attemptId: number, answers: UserAnswer[]) => {
    if (!answers || answers.length === 0) {
      throw new Error('Cannot submit an exam with no answers');
    }
    
    return apiClient.post<ExamResult>(
      `${BASE_PATH}/attempts/${attemptId}/submit`,
      { answers }
    ).then(response => {
      if (response.error) {
        throw response.error;
      }
      return response.data as ExamResult;
    });
  },

  /**
   * Get exams by status
   */
  getExamsByStatus: async (status: ExamStatusType) => {
    return apiClient.get<BackendExam[]>(`${BASE_PATH}/status/${status}`).then(response => {
      if (response.error) {
        throw response.error;
      }
      return (response.data || []).map(adaptBackendExam);
    });
  },

  /**
   * Flag a question for review later
   */
  flagQuestion: async (attemptId: number, questionId: number) => {
    return apiClient.post<void>(
      `${BASE_PATH}/attempts/${attemptId}/flag/${questionId}`
    ).then(response => {
      if (response.error) {
        throw response.error;
      }
    });
  },

  /**
   * Unflag a previously flagged question
   */
  unflagQuestion: async (attemptId: number, questionId: number) => {
    return apiClient.delete<void>(
      `${BASE_PATH}/attempts/${attemptId}/flag/${questionId}`
    ).then(response => {
      if (response.error) {
        throw response.error;
      }
    });
  },

  /**
   * Get all flagged questions for an attempt
   */
  getFlaggedQuestions: async (attemptId: number) => {
    return apiClient.get<FlaggedQuestion[]>(`${BASE_PATH}/attempts/${attemptId}/flags`).then(response => {
      if (response.error) {
        throw response.error;
      }
      return response.data || [];
    });
  }
};

// Create the extended service combining standard CRUD operations with custom methods
export const examService = createExtendedApiService<
  Exam,
  typeof customMethods
>(BASE_PATH, customMethods);

export default examService;
