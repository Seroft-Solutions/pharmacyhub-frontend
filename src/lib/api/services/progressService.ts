import { createExtendedApiService } from '../createService';
import { apiClient } from '../apiClient';
import type { ApiResponse } from '../apiClient';

/**
 * Progress tracking interface
 */
export interface Progress {
  id: string;
  userId: string;
  examId: string;
  totalQuestions: number;
  completedQuestions: number;
  correctAnswers: number;
  incorrectAnswers: number;
  skippedQuestions: number;
  lastAccessedAt: string;
  status: 'IN_PROGRESS' | 'COMPLETED' | 'ABANDONED';
  estimatedScore: number;
  timeSpent: number; // in seconds
  createdAt: string;
  updatedAt: string;
}

/**
 * Progress update data
 */
export interface ProgressUpdateData {
  completedQuestions?: number;
  correctAnswers?: number;
  incorrectAnswers?: number;
  skippedQuestions?: number;
  timeSpent?: number;
  status?: 'IN_PROGRESS' | 'COMPLETED' | 'ABANDONED';
}

/**
 * Question attempt data
 */
export interface QuestionAttempt {
  progressId: string;
  questionId: string;
  selectedOptionIds: string[];
  isCorrect: boolean;
  timeSpent: number; // in seconds
  attemptedAt: string;
}

/**
 * Progress statistics
 */
export interface ProgressStatistics {
  totalExams: number;
  completedExams: number;
  inProgressExams: number;
  averageScore: number;
  totalTimeSpent: number; // in seconds
  strongCategories: {
    category: string;
    averageScore: number;
  }[];
  weakCategories: {
    category: string;
    averageScore: number;
  }[];
  recentActivity: {
    date: string;
    examId: string;
    examTitle: string;
    action: 'STARTED' | 'CONTINUED' | 'COMPLETED';
  }[];
}

/**
 * Create a progress service with extended methods
 */
export const progressService = createExtendedApiService<Progress, {
  getUserProgress: (userId?: string) => Promise<ApiResponse<Progress[]>>;
  getExamProgress: (examId: string, userId?: string) => Promise<ApiResponse<Progress>>;
  updateProgress: (progressId: string, data: ProgressUpdateData) => Promise<ApiResponse<Progress>>;
  submitQuestionAttempt: (attempt: QuestionAttempt) => Promise<ApiResponse<QuestionAttempt>>;
  getProgressStatistics: (userId?: string) => Promise<ApiResponse<ProgressStatistics>>;
}>('/progress', {
  /**
   * Get all progress records for a user
   */
  getUserProgress: async (userId?: string) => {
    const endpoint = userId 
      ? `/users/${userId}/progress` 
      : '/users/me/progress';
    return apiClient.get<Progress[]>(endpoint);
  },

  /**
   * Get a user's progress for a specific exam
   */
  getExamProgress: async (examId: string, userId?: string) => {
    const endpoint = userId 
      ? `/users/${userId}/exams/${examId}/progress` 
      : `/users/me/exams/${examId}/progress`;
    return apiClient.get<Progress>(endpoint);
  },

  /**
   * Update a progress record
   */
  updateProgress: async (progressId: string, data: ProgressUpdateData) => {
    return apiClient.patch<Progress>(`/progress/${progressId}`, data);
  },

  /**
   * Submit an attempt for a question
   */
  submitQuestionAttempt: async (attempt: QuestionAttempt) => {
    return apiClient.post<QuestionAttempt>(`/progress/${attempt.progressId}/attempts`, attempt);
  },

  /**
   * Get progress statistics for a user
   */
  getProgressStatistics: async (userId?: string) => {
    const endpoint = userId 
      ? `/users/${userId}/progress/statistics` 
      : '/users/me/progress/statistics';
    return apiClient.get<ProgressStatistics>(endpoint);
  }
});

export default progressService;
