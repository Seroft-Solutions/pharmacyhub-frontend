import { createExtendedApiService } from '../createService';
import { apiClient } from '../apiClient';
import type { ApiResponse } from '../apiClient';
import { ApiPaginatedResponse } from '../types';

/**
 * Exam interface
 */
export interface Exam {
  id: string;
  title: string;
  description: string;
  duration: number; // in minutes
  passingScore: number;
  totalQuestions: number;
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  category: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

/**
 * Exam question interface
 */
export interface ExamQuestion {
  id: string;
  examId: string;
  questionText: string;
  options: {
    id: string;
    text: string;
    isCorrect: boolean;
  }[];
  explanation: string;
  points: number;
  questionType: 'MULTIPLE_CHOICE' | 'SINGLE_CHOICE' | 'TRUE_FALSE';
  difficultyLevel: 'EASY' | 'MEDIUM' | 'HARD';
}

/**
 * Exam submission interface
 */
export interface ExamSubmission {
  examId: string;
  answers: {
    questionId: string;
    selectedOptionIds: string[];
  }[];
  timeSpent: number; // in seconds
}

/**
 * Exam result interface
 */
export interface ExamResult {
  id: string;
  examId: string;
  userId: string;
  score: number;
  passingScore: number;
  passed: boolean;
  totalQuestions: number;
  correctAnswers: number;
  incorrectAnswers: number;
  timeSpent: number; // in seconds
  submittedAt: string;
  answers: {
    questionId: string;
    userSelectedOptionIds: string[];
    correctOptionIds: string[];
    isCorrect: boolean;
  }[];
}

/**
 * Filter parameters for exam search
 */
export interface ExamFilters {
  title?: string;
  category?: string;
  difficulty?: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  status?: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  tags?: string[];
}

/**
 * Create an exam service with extended methods
 */
export const examService = createExtendedApiService<Exam, {
  getExamQuestions: (examId: string) => Promise<ApiResponse<ExamQuestion[]>>;
  submitExam: (submission: ExamSubmission) => Promise<ApiResponse<ExamResult>>;
  getUserExamResults: (userId?: string) => Promise<ApiResponse<ExamResult[]>>;
  searchExams: (filters: ExamFilters, page: number, size: number) => Promise<ApiResponse<ApiPaginatedResponse<Exam>>>;
}>('/exams', {
  /**
   * Get all questions for a specific exam
   */
  getExamQuestions: async (examId: string) => {
    return apiClient.get<ExamQuestion[]>(`/exams/${examId}/questions`);
  },

  /**
   * Submit an exam for grading
   */
  submitExam: async (submission: ExamSubmission) => {
    return apiClient.post<ExamResult>(`/exams/${submission.examId}/submissions`, submission);
  },

  /**
   * Get exam results for a user
   */
  getUserExamResults: async (userId?: string) => {
    const endpoint = userId 
      ? `/users/${userId}/exam-results` 
      : '/users/me/exam-results';
    return apiClient.get<ExamResult[]>(endpoint);
  },

  /**
   * Search for exams with pagination and filtering
   */
  searchExams: async (filters: ExamFilters, page: number, size: number) => {
    // Build query parameters
    const queryParams = new URLSearchParams();
    
    // Add pagination
    queryParams.append('page', page.toString());
    queryParams.append('size', size.toString());
    
    // Add filters
    if (filters.title) queryParams.append('title', filters.title);
    if (filters.category) queryParams.append('category', filters.category);
    if (filters.difficulty) queryParams.append('difficulty', filters.difficulty);
    if (filters.status) queryParams.append('status', filters.status);
    if (filters.tags && filters.tags.length > 0) {
      filters.tags.forEach(tag => queryParams.append('tags', tag));
    }
    
    return apiClient.get<ApiPaginatedResponse<Exam>>(`/exams/search?${queryParams.toString()}`);
  }
});

export default examService;
