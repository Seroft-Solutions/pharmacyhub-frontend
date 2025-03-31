/**
 * API Types for Exams Preparation
 * 
 * This module defines all types related to API requests and responses
 * for the exams-preparation feature.
 */
import { ExamStatus, QuestionType, DifficultyLevel } from './enums';

/**
 * Base Exam entity interface
 */
export interface ExamBase {
  title: string;
  description?: string;
  duration: number; // Duration in minutes
  passPercentage: number;
  status: ExamStatus;
  isPremium: boolean;
  price?: number;
  totalQuestions?: number;
  tags?: string[];
}

/**
 * Complete Exam entity with ID and related data
 */
export interface Exam extends ExamBase {
  id: number;
  createdAt: string;
  updatedAt: string;
  authorId: number;
  isPublished: boolean;
  publishedAt?: string;
  thumbnail?: string;
  averageScore?: number;
  totalAttempts?: number;
  questionsCount?: number;
}

/**
 * Exam creation parameters
 */
export interface ExamCreateParams extends ExamBase {
  questions?: QuestionCreateParams[];
}

/**
 * Exam update parameters
 */
export interface ExamUpdateParams extends Partial<ExamBase> {
  id: number;
}

/**
 * Base Question entity interface
 */
export interface QuestionBase {
  text: string;
  options: string[];
  correctOption: number;
  type: QuestionType;
  difficultyLevel: DifficultyLevel;
  points: number;
  explanation?: string;
  tags?: string[];
}

/**
 * Complete Question entity with ID and related data
 */
export interface Question extends QuestionBase {
  id: number;
  examId: number;
  createdAt: string;
  updatedAt: string;
  position: number;
}

/**
 * Question creation parameters
 */
export interface QuestionCreateParams extends QuestionBase {
  examId: number;
  position?: number;
}

/**
 * Question update parameters
 */
export interface QuestionUpdateParams extends Partial<QuestionBase> {
  id: number;
  examId: number;
}

/**
 * Base Exam Attempt entity interface
 */
export interface AttemptBase {
  examId: number;
  userId: number;
  startedAt: string;
  isCompleted: boolean;
}

/**
 * Complete Exam Attempt entity with ID and related data
 */
export interface Attempt extends AttemptBase {
  id: number;
  completedAt?: string;
  timeSpent?: number; // Time spent in minutes
  score?: number;
  answers?: Answer[];
  flaggedQuestions?: number[];
}

/**
 * Interface for answers in an exam attempt
 */
export interface Answer {
  questionId: number;
  selectedOption: number;
  isCorrect?: boolean;
  pointsEarned?: number;
}

/**
 * Result of an exam attempt
 */
export interface Result {
  attemptId: number;
  examId: number;
  userId: number;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  incorrectAnswers: number;
  skippedQuestions: number;
  timeSpent: number; // Time spent in minutes
  passPercentage: number; // Exam's pass percentage
  isPassed: boolean;
  completedAt: string;
  questionResults: QuestionResult[];
}

/**
 * Result for a single question
 */
export interface QuestionResult {
  questionId: number;
  text: string;
  correctOption: number;
  selectedOption: number;
  isCorrect: boolean;
  points: number;
  pointsEarned: number;
  explanation?: string;
}

/**
 * Base Paper entity interface
 */
export interface PaperBase {
  title: string;
  description?: string;
  type: 'model' | 'past' | 'subject' | 'practice';
  year?: number;
  subject?: string;
  totalQuestions: number;
  duration: number; // Duration in minutes
  isPremium: boolean;
  price?: number;
}

/**
 * Complete Paper entity with ID and related data
 */
export interface Paper extends PaperBase {
  id: number;
  createdAt: string;
  updatedAt: string;
  authorId: number;
  thumbnail?: string;
  averageScore?: number;
  totalAttempts?: number;
}

/**
 * Pagination metadata
 */
export interface PaginationMeta {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

/**
 * Paginated response wrapper
 */
export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

/**
 * Search parameters for exams
 */
export interface ExamSearchParams {
  page?: number;
  limit?: number;
  status?: ExamStatus;
  search?: string;
  tag?: string;
  sortBy?: string;
  sortDir?: 'asc' | 'desc';
  isPremium?: boolean;
  authorId?: number;
}

/**
 * Payment-related interfaces
 */

/**
 * Payment entity
 */
export interface Payment {
  id: number;
  examId: number;
  userId: number;
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  transactionId: string;
  createdAt: string;
}

/**
 * Payment Intent for client-side payment processing
 */
export interface PaymentIntent {
  clientSecret: string;
  amount: number;
}

/**
 * Payment creation parameters
 */
export interface PaymentCreateParams {
  examId: number;
  amount: number;
}

/**
 * Payment confirmation parameters
 */
export interface PaymentConfirmParams {
  examId: number;
  paymentIntentId: string;
}

/**
 * Access check response
 */
export interface AccessCheckResponse {
  hasAccess: boolean;
  reason?: string;
}

/**
 * Exam statistics
 */
export interface ExamStats {
  totalExams: number;
  totalPublishedExams: number;
  totalAttempts: number;
  totalUsers: number;
  averageScore: number;
  topPerformingExams: {
    id: number;
    title: string;
    averageScore: number;
    totalAttempts: number;
  }[];
  recentActivityOverTime: {
    date: string;
    attempts: number;
    newUsers: number;
  }[];
}
