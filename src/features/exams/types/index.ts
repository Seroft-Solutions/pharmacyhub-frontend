export interface ExamPaper {
  id: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  totalQuestions: number;
  duration: number;
  topics: string[];
  isPremium: boolean;
  attempts: number;
  successRate: number;
  lastUpdated: string;
  source: 'model' | 'past';
}

export interface ExamPaperMetadata {
  id: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  topics_covered: string[];
  total_questions: number;
  time_limit: number;
  is_premium: boolean;
  source: 'model' | 'past';
}

export interface Exam {
  id: number;
  title: string;
  description: string;
  duration: number;
  maxScore: number;
  passingScore: number;
  status: ExamStatusType;
  questions: ExamQuestion[];
}

export interface ExamQuestion {
  id: number;
  text: string;
  options: ExamOption[];
  explanation: string;
  points: number;
}

export interface ExamOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

export enum ExamStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  ARCHIVED = 'ARCHIVED'
}

export type ExamStatusType = keyof typeof ExamStatus;
