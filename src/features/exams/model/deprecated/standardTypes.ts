/**
 * DEPRECATED - Use the consolidated types from `features/exams/types` instead
 */

// Exam difficulty levels
export enum Difficulty {
  EASY = 'EASY',
  MEDIUM = 'MEDIUM',
  HARD = 'HARD'
}

// Exam paper types
export enum PaperType {
  PRACTICE = 'PRACTICE',
  MODEL = 'MODEL',
  PAST = 'PAST',
  SUBJECT = 'SUBJECT'
}

// Option in a question
export interface Option {
  label: string;
  text: string;
}

// Structure of a question
export interface Question {
  questionNumber: number;
  text: string;
  options: Option[];
  correctAnswer: string;
  explanation?: string;
}

// Structure of an exam
export interface Exam {
  id?: string;
  title: string;
  description: string;
  duration: number;
  passingMarks: number;
  status: 'DRAFT' | 'PUBLISHED';
  tags: string[];
  questions: Question[];
}
