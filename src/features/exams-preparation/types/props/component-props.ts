/**
 * Component prop types for the exams feature
 */

import { ReactNode } from 'react';
import { Exam, Question, ExamResult, ExamAttempt, DifficultyLevel } from '../models/exam';

/**
 * Atom component props
 */

export interface ExamLabelProps {
  status: string;
  className?: string;
}

export interface QuestionIndicatorProps {
  index: number;
  isActive?: boolean;
  isAnswered?: boolean;
  isCorrect?: boolean;
  onClick?: () => void;
}

export interface DifficultyBadgeProps {
  difficulty: DifficultyLevel;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export interface ExamTimerProps {
  timeInSeconds: number;
  isRunning?: boolean;
  onComplete?: () => void;
  className?: string;
}

/**
 * Molecule component props
 */

export interface ExamCardProps {
  exam: Exam;
  variant?: 'default' | 'compact' | 'detailed';
  showActions?: boolean;
  onSelect?: (examId: number) => void;
  showPurchaseDate?: boolean;
  purchaseInfo?: {
    purchaseDate: string;
    expiryDate?: string;
  };
}

export interface QuestionFormProps {
  question?: Question;
  examId: number;
  onSave: (question: Question) => void;
  onCancel?: () => void;
  isSubmitting?: boolean;
}

export interface ExamPurchaseModalProps {
  exam: Exam;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export interface QuestionNavigatorProps {
  currentIndex: number;
  totalQuestions: number;
  answeredQuestions: Record<number, boolean>;
  onNavigate: (index: number) => void;
}

export interface ExamFilterBarProps {
  onFilterChange: (filters: Record<string, any>) => void;
  initialFilters?: Record<string, any>;
  showCategoryFilter?: boolean;
  showStatusFilter?: boolean;
  showPremiumFilter?: boolean;
}

/**
 * Organism component props
 */

export interface ExamDashboardProps {
  userId?: string;
  filterDefaults?: {
    status?: string;
    category?: string;
  };
}

export interface ExamEditorProps {
  examId?: number;
  onSaved?: (exam: Exam) => void;
}

export interface ExamAttemptScreenProps {
  examId: number;
  attemptId?: string;
}

export interface ExamResultsProps {
  examId: number;
  attemptId?: string;
}

export interface QuestionBankProps {
  examId: number;
  onQuestionSelect?: (questionId: number) => void;
}

export interface AdminExamListProps {
  defaultFilters?: Record<string, any>;
  showPagination?: boolean;
  pageSize?: number;
}

/**
 * Template component props
 */

export interface ExamPageTemplateProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  actions?: ReactNode;
  sidebar?: ReactNode;
}

export interface QuestionPageTemplateProps {
  examTitle: string;
  questionNumber: number;
  totalQuestions: number;
  timer?: ReactNode;
  navigator?: ReactNode;
  children: ReactNode;
  actions?: ReactNode;
}

/**
 * Guard component props
 */

export interface ExamOperationGuardProps {
  operation: string;
  children: ReactNode;
  fallback?: ReactNode;
}

export interface PaymentRequiredGuardProps {
  examId: number;
  children: ReactNode;
}
