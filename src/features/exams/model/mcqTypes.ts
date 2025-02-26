import { ExamPaperMetadata } from './types';

export enum ExamStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  ARCHIVED = 'ARCHIVED'
}

export interface ExamOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface ExamQuestion {
  id: number;
  text: string;
  options: ExamOption[];
  explanation: string;
  points: number;
}

export interface Exam {
  id: number;
  title: string;
  description: string;
  duration: number; // in minutes
  totalMarks: number;
  passingMarks: number;
  status: ExamStatus;
  createdAt?: string;
  updatedAt?: string;
  questions?: ExamQuestion[];
}

export interface UserAnswer {
  questionId: number;
  selectedOptionId: string;
  timeSpent: number;
}

export interface ExamAttempt {
  id: number;
  examId: number;
  userId: string;
  startTime: string;
  endTime?: string;
  score?: number;
  answers: UserAnswer[];
  status: 'IN_PROGRESS' | 'COMPLETED' | 'ABANDONED';
}

export interface ExamResult {
  examId: number;
  examTitle: string;
  score: number;
  totalMarks: number;
  passingMarks: number;
  isPassed: boolean;
  timeSpent: number;
  questionResults: {
    questionId: number;
    questionText: string;
    userAnswerId?: string;
    correctAnswerId: string;
    isCorrect: boolean;
    explanation: string;
    points: number;
    earnedPoints: number;
  }[];
}
