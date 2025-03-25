// User answer to a question
export interface UserAnswer {
  questionId: number;
  selectedOption: number;
  isCorrect?: boolean;
}

// Question result in exam results
export interface QuestionResult {
  questionId: number;
  userAnswer: number;
  correctAnswer: number;
  isCorrect: boolean;
  points: number;
  explanation: string;
}

// Exam result model
export interface ExamResult {
  attemptId: number;
  examId: number;
  examTitle: string;
  score: number;
  totalMarks: number;
  passingMarks: number;
  isPassed: boolean;
  timeSpent: number;
  totalQuestions: number;
  correctAnswers: number;
  incorrectAnswers: number;
  unanswered: number;
  completedAt: string;
  questionResults?: QuestionResult[];
}

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

// Question model
export interface Question {
  id: number;
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