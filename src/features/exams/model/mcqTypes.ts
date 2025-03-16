/**
 * MCQ Exam Types
 * 
 * This file defines the types used in the MCQ exam feature.
 */

export interface Option {
  label: string; // A, B, C, D
  text: string; // The actual option text
  isCorrect?: boolean; // Whether this is the correct option
}

export interface Question {
  id: number;
  questionNumber: number;
  text: string;
  options: Option[];
  explanation?: string; // Explanation after answering
  marks: number; // Points for this question
}

export interface Exam {
  id: number;
  title: string;
  description: string;
  duration: number; // in minutes
  totalMarks: number;
  passingMarks: number;
  questions?: Question[];
}

export interface UserAnswer {
  questionId: number;
  selectedOption: number;
  timeSpent?: number; // Time spent on this question in seconds
}

export interface ExamSession {
  id: number;
  examId: number;
  userId: string;
  startTime: string;
  endTime?: string;
  status: 'IN_PROGRESS' | 'COMPLETED' | 'ABANDONED';
  answers?: UserAnswer[];
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

export interface QuestionResult {
  questionId: number;
  userAnswer: number;
  correctAnswer: number;
  isCorrect: boolean;
  points: number;
  explanation?: string;
}
