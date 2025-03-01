// Base types for exam entities

export interface Option {
  id: string;
  text: string;
  isCorrect?: boolean; // Only provided during creation or for instructors
}

export interface Question {
  id: number;
  questionNumber: number;
  text: string;
  options: Option[];
  explanation?: string;
  marks: number;
}

export interface Exam {
  id: number;
  title: string;
  description: string;
  duration: number; // in minutes
  totalMarks: number;
  passingMarks: number;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  questions?: Question[];
}

// Exam attempt related types

export interface ExamAttempt {
  id: number;
  examId: number;
  userId: string;
  startTime: string;
  endTime?: string;
  status: 'IN_PROGRESS' | 'COMPLETED' | 'ABANDONED';
  answers?: UserAnswer[];
}

export interface UserAnswer {
  questionId: number;
  selectedOption: number; // index of the selected option
  timeSpent?: number; // in seconds
}

export interface FlaggedQuestion {
  questionId: number;
  attemptId: number;
}

// Exam result related types

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

// Exam statistics and dashboard types

export interface ExamStats {
  totalPapers: number;
  avgDuration: number;
  completionRate: number;
  activeUsers: number;
}

// ExamSession type for Zustand store

export interface ExamSession {
  attemptId: number;
  startTime: string;
  endTime?: string;
  status: 'IN_PROGRESS' | 'COMPLETED' | 'ABANDONED';
}

// Types for MCQ exams

export interface MCQPaper {
  id: number;
  title: string;
  description: string;
  timeLimit: number; // in minutes
  passingCriteria: {
    minimumScore: number;
    minimumQuestions: number;
  };
  totalQuestions: number;
  questions: Question[];
}
