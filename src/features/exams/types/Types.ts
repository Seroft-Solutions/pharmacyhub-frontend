/**
 * Exam types for the exams feature
 */

/**
 * Question interface for representing a question in the system
 */
export interface MCQuestion {
  id: string | number;
  question: string;
  options: Record<string, string>;
  answer: string;
  explanation?: string;
  metadata?: {
    topic?: string;
    difficulty?: 'easy' | 'medium' | 'hard';
    points?: number;
    timeAllocation?: number;
    tags?: string[];
    keyPoints?: string[];
    references?: string[];
  };
}

/**
 * Section interface for representing a section of questions
 */
export interface MCSection {
  id: string | number;
  title: string;
  description?: string;
  questions: MCQuestion[];
}

/**
 * Paper interface for representing a full exam paper
 */
export interface MCQPaper {
  id: string | number;
  title: string;
  description?: string;
  totalQuestions: number;
  totalMarks: number;
  duration: number; // in minutes
  passingMarks: number;
  sections: MCSection[];
  metadata?: {
    author?: string;
    created?: string;
    lastUpdated?: string;
    category?: string;
    subcategory?: string;
    tags?: string[];
    instructions?: string;
    difficulty?: 'easy' | 'medium' | 'hard';
  };
}

/**
 * User Answer interface for representing a user's answer to a question
 */
export interface UserAnswer {
  questionId: string | number;
  selectedOption: string;
  timeSpent?: number; // seconds spent on this question
  flagged?: boolean;
  isCorrect?: boolean;
  timestamp?: string;
}

/**
 * Exam Stats interface for representing exam statistics
 */
export interface ExamStats {
  totalQuestions: number;
  answeredQuestions: number;
  correctAnswers: number;
  incorrectAnswers: number;
  unansweredQuestions: number;
  totalMarks: number;
  obtainedMarks: number;
  percentageScore: number;
  isPassed: boolean;
  timeSpent: number; // in seconds
  averageTimePerQuestion: number; // in seconds
}

/**
 * Exam Attempt interface for representing a user's attempt at an exam
 */
export interface ExamAttempt {
  id: string | number;
  examId: string | number;
  userId: string | number;
  startedAt: string;
  completedAt?: string;
  isCompleted: boolean;
  timeSpent?: number; // in seconds
  answers: UserAnswer[];
  status: 'in-progress' | 'completed' | 'cancelled';
}

/**
 * Exam Result interface for representing the result of an exam attempt
 */
export interface ExamResult {
  attemptId: string | number;
  examId: string | number;
  userId: string | number;
  score: number;
  totalMarks: number;
  passingMarks: number;
  isPassed: boolean;
  completedAt: string;
  timeSpent: number; // in seconds
  totalQuestions: number;
  correctAnswers: number;
  incorrectAnswers: number;
  unanswered: number;
  examTitle?: string;
  questionResults?: {
    questionId: string | number;
    isCorrect: boolean;
    selectedOption?: string;
    correctOption: string;
    points: number;
  }[];
}
