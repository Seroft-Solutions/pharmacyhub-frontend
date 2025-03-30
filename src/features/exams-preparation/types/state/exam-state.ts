/**
 * State management types for the exams feature
 */

import { Question, ExamAnswer, DifficultyLevel } from '../models/exam';

/**
 * Zustand store state for exam editor
 */
export interface ExamEditorState {
  // State
  questions: Question[];
  currentQuestionIndex: number;
  isDirty: boolean;
  validation: Record<string, string[]>;
  
  // Actions
  addQuestion: (question: Question) => void;
  updateQuestion: (index: number, question: Question) => void;
  removeQuestion: (index: number) => void;
  reorderQuestions: (fromIndex: number, toIndex: number) => void;
  setCurrentQuestion: (index: number) => void;
  validateExam: () => boolean;
  markAsSaved: () => void;
}

/**
 * Zustand store state for exam attempt
 */
export interface ExamAttemptState {
  // State
  examId: number | null;
  startTime: string | null;
  timeSpent: number; // in seconds
  currentQuestionIndex: number;
  answers: Record<number, ExamAnswer>;
  
  // Actions
  startExam: (examId: number) => void;
  setAnswer: (questionId: number, answer: Partial<ExamAnswer>) => void;
  nextQuestion: () => void;
  prevQuestion: () => void;
  jumpToQuestion: (index: number) => void;
  updateTimeSpent: (seconds: number) => void;
  submitExam: () => Promise<boolean>;
  resetAttempt: () => void;
}

/**
 * Context types for exam filters
 */
export interface ExamFilterContextType {
  filters: ExamFilters;
  setFilter: <K extends keyof ExamFilters>(key: K, value: ExamFilters[K]) => void;
  clearFilters: () => void;
}

/**
 * Filter options for exam search and listing
 */
export interface ExamFilters {
  status?: string;
  search?: string;
  category?: string;
  difficulty?: DifficultyLevel;
  isPremium?: boolean;
}

/**
 * Context types for exam session
 */
export interface ExamSessionContextType {
  isTimerActive: boolean;
  remainingTime: number | null; // in seconds
  startTimer: () => void;
  pauseTimer: () => void;
  resetTimer: (duration: number) => void;
}
