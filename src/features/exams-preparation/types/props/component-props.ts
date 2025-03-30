/**
 * Component prop types for exams preparation feature
 * 
 * These types define the props for all components in the exams preparation feature.
 * Using standardized prop types improves consistency and maintainability.
 */

import { Exam, Question, ExamAttempt, ExamResult } from '../models/exam';
import { DifficultyLevel, QuestionType } from '../models/exam';

/**
 * Props for the exam card component
 */
export interface ExamCardProps {
  exam: Exam;
  progress?: ExamProgressInfo;
  onClick?: (exam: Exam) => void;
  showPrice?: boolean;
  showProgress?: boolean;
}

/**
 * Props for the exam details component
 */
export interface ExamDetailsProps {
  exam: Exam;
  progress?: ExamProgressInfo;
  onStart?: (exam: Exam) => void;
  onContinue?: (exam: Exam, attemptId: string) => void;
  onReview?: (exam: Exam, attemptId: string) => void;
}

/**
 * Props for the exam list component
 */
export interface ExamListProps {
  exams: Exam[];
  progress?: Record<number, ExamProgressInfo>;
  onSelectExam?: (exam: Exam) => void;
  isLoading?: boolean;
  filter?: ExamFilterOptions;
  onFilterChange?: (filter: ExamFilterOptions) => void;
}

/**
 * Props for the question component
 */
export interface QuestionProps {
  question: Question;
  selectedAnswer?: string | string[];
  onAnswerChange?: (questionId: number, answer: string | string[]) => void;
  showExplanation?: boolean;
  showCorrectAnswer?: boolean;
  isReview?: boolean;
  isDisabled?: boolean;
}

/**
 * Props for the exam timer component
 */
export interface ExamTimerProps {
  duration: number; // in seconds
  startTime: string;
  onTimeExpired?: () => void;
  isPaused?: boolean;
}

/**
 * Props for the exam progress component
 */
export interface ExamProgressProps {
  currentQuestion: number;
  totalQuestions: number;
  answeredQuestions: number[];
  currentTime: number; // in seconds
  totalTime: number; // in seconds
  onQuestionSelect?: (questionIndex: number) => void;
}

/**
 * Props for the exam results component
 */
export interface ExamResultsProps {
  result: ExamResult;
  onRetry?: () => void;
  onReview?: () => void;
  onNewExam?: () => void;
}

/**
 * Props for the payment component
 */
export interface ExamPaymentProps {
  exam: Exam;
  onSuccess?: (transactionId: string) => void;
  onCancel?: () => void;
}

/**
 * Exam progress information
 */
export interface ExamProgressInfo {
  attemptsCount: number;
  bestScore?: number;
  lastAttemptDate?: string;
  lastAttemptId?: string;
  isCompleted?: boolean;
  isPassed?: boolean;
  inProgress?: boolean;
  currentAttemptId?: string;
}

/**
 * Exam filter options
 */
export interface ExamFilterOptions {
  search?: string;
  difficulty?: DifficultyLevel | 'all';
  isPremium?: boolean | 'all';
  status?: 'completed' | 'inProgress' | 'notStarted' | 'all';
  sortBy?: 'title' | 'date' | 'difficulty' | 'progress';
  sortDirection?: 'asc' | 'desc';
}

/**
 * Question navigation props
 */
export interface QuestionNavigationProps {
  currentQuestion: number;
  totalQuestions: number;
  onPrevious?: () => void;
  onNext?: () => void;
  onFinish?: () => void;
  isFirstQuestion?: boolean;
  isLastQuestion?: boolean;
  isDisabled?: boolean;
}

/**
 * Answer option props
 */
export interface AnswerOptionProps {
  id: string;
  text: string;
  isSelected?: boolean;
  isCorrect?: boolean;
  isIncorrect?: boolean;
  onSelect?: (id: string) => void;
  disabled?: boolean;
  showCorrectness?: boolean;
  label?: string;
}

/**
 * Exam search props
 */
export interface ExamSearchProps {
  value?: string;
  onChange?: (value: string) => void;
  onSearch?: (value: string) => void;
  placeholder?: string;
  isLoading?: boolean;
}

/**
 * Exam filter props
 */
export interface ExamFilterProps {
  filter: ExamFilterOptions;
  onChange: (filter: ExamFilterOptions) => void;
  difficulties?: DifficultyLevel[];
}

/**
 * Exam progress stats props
 */
export interface ExamProgressStatsProps {
  completedExams: number;
  totalExams: number;
  passedExams: number;
  averageScore: number;
  bestScore: number;
  totalTimeSpent: number; // in minutes
}
