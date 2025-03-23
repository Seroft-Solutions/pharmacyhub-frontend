/**
 * Consolidated Types for Exams Feature
 * 
 * This file serves as the single source of truth for all exam-related types.
 * It consolidates and standardizes types previously spread across multiple files.
 */

// =================== Enums and Constants ===================

/**
 * Exam status types
 */
export enum ExamStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  ARCHIVED = 'ARCHIVED'
}

/**
 * Attempt status types
 */
export enum AttemptStatus {
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  ABANDONED = 'ABANDONED'
}

/**
 * Paper types
 */
export enum PaperType {
  MODEL = 'MODEL',
  PAST = 'PAST',
  SUBJECT = 'SUBJECT',
  PRACTICE = 'PRACTICE'
}

/**
 * Difficulty levels
 */
export enum Difficulty {
  EASY = 'EASY',
  MEDIUM = 'MEDIUM',
  HARD = 'HARD'
}

// =================== Base Entity Types ===================

/**
 * Option in a question
 */
export interface Option {
  id: number;
  label: string;
  text: string;
  isCorrect?: boolean; // Only provided during creation or for instructors
}

/**
 * Question structure
 */
export interface Question {
  id: number;
  questionNumber: number;
  text: string;
  options: Option[];
  correctAnswer?: string;
  explanation?: string;
  marks: number;
}

/**
 * Exam structure
 */
export interface Exam {
  id: number;
  title: string;
  description: string;
  duration: number; // in minutes
  totalMarks: number;
  passingMarks: number;
  status: ExamStatus;
  questions?: Question[];
  tags?: string[];
}

// =================== Paper Types ===================

/**
 * Exam paper structure
 */
export interface ExamPaper {
  id: number | string;
  title: string;
  description: string;
  difficulty: keyof typeof Difficulty | string;
  questionCount: number;
  durationMinutes: number;
  tags: string[];
  premium: boolean;
  attemptCount: number;
  successRatePercent: number;
  lastUpdatedDate: string;
  type: keyof typeof PaperType | string;
  examId?: number;
  paymentStatus?: string;
}

/**
 * Metadata for papers with minimal info
 */
export interface ExamPaperMetadata {
  id: number | string;
  title: string;
  description: string;
  difficulty: string;
  topics_covered: string[];
  total_questions: number;
  time_limit: number; // in minutes
  is_premium: boolean;
  source: string; // 'model', 'past', 'subject', 'practice'
}

// =================== Attempt and Answer Types ===================

/**
 * User answer structure
 */
export interface UserAnswer {
  questionId: number;
  selectedOption: number; // index/id of the selected option
  timeSpent?: number; // in seconds
}

/**
 * Exam attempt structure
 */
export interface ExamAttempt {
  id: number;
  examId: number;
  userId: string;
  startTime: string;
  endTime?: string;
  status: AttemptStatus;
  answers?: UserAnswer[];
}

/**
 * Flagged question structure
 */
export interface FlaggedQuestion {
  questionId: number;
  attemptId: number;
}

// =================== Result Types ===================

/**
 * Question result structure
 */
export interface QuestionResult {
  questionId: number;
  questionText: string;
  userAnswerId: string;
  correctAnswerId: string;
  isCorrect: boolean;
  explanation?: string;
  points: number;
  earnedPoints: number;
}

/**
 * Exam result structure
 */
export interface ExamResult {
  attemptId: number;
  examId: number;
  examTitle: string;
  score: number;
  totalMarks: number;
  passingMarks: number;
  isPassed: boolean;
  timeSpent: number; // in seconds
  totalQuestions: number;
  correctAnswers: number;
  incorrectAnswers: number;
  unanswered: number;
  completedAt: string;
  questionResults: QuestionResult[];
}

// =================== Statistics Types ===================

/**
 * Exam statistics structure
 */
export interface ExamStats {
  totalPapers: number;
  avgDuration: number;
  completionRate: number;
  activeUsers: number;
}

// =================== Component Props Types ===================

/**
 * Exam paper card props
 */
export interface ExamPaperCardProps {
  paper: ExamPaperMetadata;
  progress?: ExamPaperProgress;
  onStart: (paper: ExamPaperMetadata) => void;
}

/**
 * Exam paper progress
 */
export interface ExamPaperProgress {
  completed: boolean;
  score?: number;
  bestScore?: number;
  lastAttempted?: string;
  attempts?: number;
}

// =================== Section Types ===================

/**
 * Section interface for representing a section of questions
 */
export interface MCSection {
  id: string | number;
  title: string;
  description?: string;
  questions: Question[];
}

// =================== Re-export for backward compatibility ===================

// Export older type names for backward compatibility
// These will be gradually phased out in favor of the standardized types above
export type ExamStatusType = keyof typeof ExamStatus;
export type AttemptStatusType = keyof typeof AttemptStatus;
export type { Question as MCQuestion };
export type { ExamPaper as MCQPaper };

// Export the entire namespace for convenience
export * from './enums';
