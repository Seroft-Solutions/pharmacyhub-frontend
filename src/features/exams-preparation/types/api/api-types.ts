/**
 * API-specific types for exams preparation
 * 
 * These types represent the data structures used in API requests and responses
 * for the exams preparation feature.
 */

import { ExamStatus, AttemptStatus, PaperType, Difficulty, PaymentStatus } from './enums';

/**
 * API response for an exam paper listing
 */
export interface ExamPaperResponse {
  id: number | string;
  title: string;
  description: string;
  difficulty: keyof typeof Difficulty | string;
  questionCount: number;
  durationMinutes: number;
  tags: string[];
  premium: boolean;
  price?: number;
  attemptCount: number;
  successRatePercent: number;
  lastUpdatedDate: string;
  type: keyof typeof PaperType | string;
  examId?: number;
  paymentStatus?: PaymentStatus | string;
}

/**
 * API request to create or update an exam
 */
export interface ExamRequestDto {
  title: string;
  description?: string;
  timeLimit: number; // in minutes
  passingScore: number; // percentage
  status?: ExamStatus;
  isPremium?: boolean;
  price?: number;
  questions?: QuestionRequestDto[];
}

/**
 * API request to create or update a question
 */
export interface QuestionRequestDto {
  text: string;
  type: string;
  orderIndex?: number;
  pointValue: number;
  explanation?: string;
  options: QuestionOptionRequestDto[];
  correctAnswers?: string[];
  difficulty?: string;
}

/**
 * API request for a question option
 */
export interface QuestionOptionRequestDto {
  id?: string;
  text: string;
  isCorrect?: boolean;
}

/**
 * API request to start an exam attempt
 */
export interface StartAttemptRequestDto {
  examId: number;
}

/**
 * API response for an exam attempt
 */
export interface AttemptResponseDto {
  id: string;
  examId: number;
  userId: string;
  startedAt: string;
  completedAt?: string;
  status: AttemptStatus | string;
  score?: number;
  percentage?: number;
  passed?: boolean;
  answers?: Record<number, AnswerResponseDto>;
}

/**
 * API response for an answer
 */
export interface AnswerResponseDto {
  questionId: number;
  selectedOptions?: string[];
  textAnswer?: string;
  isCorrect?: boolean;
  pointsAwarded?: number;
}

/**
 * API request to submit an answer
 */
export interface SubmitAnswerRequestDto {
  attemptId: string;
  questionId: number;
  selectedOptions?: string[];
  textAnswer?: string;
}

/**
 * API request to complete an exam attempt
 */
export interface CompleteAttemptRequestDto {
  attemptId: string;
}

/**
 * API response for exam results
 */
export interface ExamResultResponseDto {
  attemptId: string;
  examId: number;
  userId: string;
  totalQuestions: number;
  answeredQuestions: number;
  correctAnswers: number;
  score: number;
  percentage: number;
  passed: boolean;
  timeSpent: number; // in seconds
  completedAt: string;
  feedback?: string;
  questionResults?: QuestionResultDto[];
}

/**
 * API response for a question result
 */
export interface QuestionResultDto {
  questionId: number;
  text: string;
  selectedOptions?: string[];
  correctOptions: string[];
  isCorrect: boolean;
  pointValue: number;
  pointsAwarded: number;
  explanation?: string;
}

/**
 * API response for exam stats
 */
export interface ExamStatsResponseDto {
  totalExams: number;
  completedExams: number;
  passedExams: number;
  averageScore: number;
  bestScore: number;
  timeSpent: number; // in minutes
}

/**
 * API response for payment processing
 */
export interface PaymentResponseDto {
  paymentId: string;
  status: PaymentStatus | string;
  amount: number;
  currency: string;
  examId: number;
  userId: string;
  createdAt: string;
  updatedAt: string;
  redirectUrl?: string;
}
