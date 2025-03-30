/**
 * Exam domain models and related types
 */

/**
 * Possible statuses for an exam
 */
export type ExamStatus = 'draft' | 'published' | 'archived';

/**
 * Represents an exam with all its metadata and settings
 */
export interface Exam {
  id: number;
  title: string;
  description?: string;
  timeLimit: number; // in minutes
  passingScore: number; // percentage
  status: ExamStatus;
  isPremium: boolean;
  price?: number;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  questionCount: number;
}

/**
 * Represents an exam with all its questions loaded
 */
export interface ExamWithQuestions extends Exam {
  questions: Question[];
}

/**
 * Type of questions supported in the exam system
 */
export type QuestionType = 'multipleChoice' | 'singleChoice' | 'trueFalse' | 'matching' | 'shortAnswer';

/**
 * Represents a question within an exam
 */
export interface Question {
  id: number;
  examId: number;
  text: string;
  type: QuestionType;
  orderIndex: number;
  pointValue: number;
  explanation?: string;
  options?: QuestionOption[];
  correctAnswers?: string[];
  createdAt: string;
  updatedAt: string;
}

/**
 * Represents an answer option for a question
 */
export interface QuestionOption {
  id: string;
  text: string;
  isCorrect?: boolean;
}

/**
 * Represents a student's attempt at an exam
 */
export interface ExamAttempt {
  id: string;
  examId: number;
  userId: string;
  startedAt: string;
  completedAt?: string;
  timeSpent?: number; // in seconds
  score?: number;
  percentage?: number;
  passed?: boolean;
  answers: Record<number, ExamAnswer>;
}

/**
 * Represents a student's answer to a specific question
 */
export interface ExamAnswer {
  questionId: number;
  selectedOptions?: string[];
  textAnswer?: string;
  isCorrect?: boolean;
  pointsAwarded?: number;
}

/**
 * Represents the calculated results of an exam attempt
 */
export interface ExamResult {
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
}
