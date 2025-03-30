/**
 * State types for exams preparation feature
 * 
 * These types define the state management structures for the exams preparation feature,
 * including Zustand store types and context types.
 */

import { Exam, Question, ExamAttempt, ExamResult } from '../models/exam';

/**
 * Exam list store state
 */
export interface ExamListState {
  exams: Exam[];
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchExams: () => Promise<void>;
  filterExams: (filter: ExamFilterOptions) => void;
  clearError: () => void;
}

/**
 * Filter options for exams
 */
export interface ExamFilterOptions {
  search?: string;
  difficulty?: string | 'all';
  isPremium?: boolean | 'all';
  completed?: boolean | 'all';
  sortBy?: 'title' | 'date' | 'difficulty';
  sortDirection?: 'asc' | 'desc';
}

/**
 * Active exam store state
 */
export interface ActiveExamState {
  exam: Exam | null;
  attempt: ExamAttempt | null;
  currentQuestionIndex: number;
  answers: Record<number, string | string[]>;
  flaggedQuestions: Set<number>;
  timeRemaining: number; // in seconds
  isLoading: boolean;
  error: string | null;
  
  // Actions
  loadExam: (examId: number) => Promise<void>;
  startAttempt: () => Promise<void>;
  continueAttempt: (attemptId: string) => Promise<void>;
  submitAnswer: (questionId: number, answer: string | string[]) => Promise<void>;
  flagQuestion: (questionId: number, flagged: boolean) => void;
  navigateToQuestion: (index: number) => void;
  finishAttempt: () => Promise<ExamResult>;
  resetExam: () => void;
  updateTimeRemaining: (seconds: number) => void;
}

/**
 * Exam results store state
 */
export interface ExamResultsState {
  results: Record<string, ExamResult>; // attemptId -> result
  isLoading: boolean;
  error: string | null;
  
  // Actions
  loadResult: (attemptId: string) => Promise<void>;
  loadAllResults: () => Promise<void>;
  clearError: () => void;
}

/**
 * Exam progress store state
 */
export interface ExamProgressState {
  progress: Record<number, ExamProgress>; // examId -> progress
  isLoading: boolean;
  error: string | null;
  
  // Actions
  loadProgress: () => Promise<void>;
  updateProgress: (examId: number, progress: ExamProgress) => void;
  clearError: () => void;
}

/**
 * Progress for a single exam
 */
export interface ExamProgress {
  examId: number;
  attemptsCount: number;
  bestScore: number | null;
  lastAttemptDate: string | null;
  lastAttemptId: string | null;
  isCompleted: boolean;
  isPassed: boolean;
  inProgress: boolean;
  currentAttemptId: string | null;
}

/**
 * Exam payments store state
 */
export interface ExamPaymentsState {
  purchasedExams: Set<number>;
  hasUniversalAccess: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  loadPurchasedExams: () => Promise<void>;
  purchaseExam: (examId: number) => Promise<boolean>;
  checkAccess: (examId: number) => boolean;
  clearError: () => void;
}

/**
 * Context for handling the current exam question
 */
export interface QuestionContextType {
  currentQuestion: Question | null;
  selectedAnswer: string | string[] | null;
  isAnswered: boolean;
  isPreviouslyAnswered: boolean;
  isCorrect: boolean | null;
  isReview: boolean;
  onAnswerSelect: (answer: string | string[]) => void;
  onNext: () => void;
  onPrevious: () => void;
  onFlag: (flagged: boolean) => void;
  onFinish: () => void;
  flagged: boolean;
  timeSpent: number; // in seconds
}

/**
 * Context for handling timer and time tracking
 */
export interface TimerContextType {
  timeRemaining: number; // in seconds
  totalTime: number; // in seconds
  isPaused: boolean;
  isExpired: boolean;
  pauseTimer: () => void;
  resumeTimer: () => void;
  resetTimer: (seconds: number) => void;
}
