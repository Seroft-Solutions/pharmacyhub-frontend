// Status Types
export enum ExamStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  ARCHIVED = 'ARCHIVED'
}

export enum AttemptStatus {
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  ABANDONED = 'ABANDONED'
}

export enum PaperType {
  MODEL = 'MODEL',
  PAST = 'PAST',
  SUBJECT = 'SUBJECT', // Added for frontend needs
  PRACTICE = 'PRACTICE' // Added for frontend needs
}

export enum Difficulty {
  EASY = 'EASY',
  MEDIUM = 'MEDIUM',
  HARD = 'HARD'
}

// Base Entities
export interface Option {
  id: number;
  label: string; // Called optionKey in some responses
  text: string;  // Called optionText in some responses
  isCorrect?: boolean; // Only provided during creation or for instructors
}

export interface Question {
  id: number;
  questionNumber: number;
  text: string; // Called questionText in some responses
  options: Option[];
  correctAnswer?: string;
  explanation?: string;
  marks: number; // Called points in some frontend models
}

export interface Exam {
  id: number;
  title: string;
  description: string;
  duration: number; // in minutes
  totalMarks: number;
  passingMarks: number;
  status: ExamStatus;
  questions?: Question[];
  premium: boolean;
  price: number;
  purchased?: boolean;
}

// Paper Entities
export interface ExamPaper {
  id: number | string;
  title: string;
  description: string;
  difficulty: keyof typeof Difficulty | string;
  questionCount: number; // Called totalQuestions in some models
  durationMinutes: number; // Called duration in some models
  tags: string[]; // Called topics in some models
  premium: boolean; // Called isPremium in some models
  price: number;
  purchased?: boolean;
  attemptCount: number;
  successRatePercent: number;
  lastUpdatedDate: string;
  type: keyof typeof PaperType | string;
  examId?: number; // Optional reference to the full exam
}

// Attempt Entities
export interface UserAnswer {
  questionId: number;
  selectedOptionId: string;
  timeSpent: number; // in seconds
}

export interface ExamAttempt {
  id: number;
  examId: number;
  userId: string;
  startTime: string;
  endTime?: string;
  status: AttemptStatus;
  answers?: UserAnswer[];
}

export interface FlaggedQuestion {
  questionId: number;
  attemptId: number;
}

// Result Entities
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

// Statistics Entities
export interface ExamStats {
  totalPapers: number;
  avgDuration: number;
  completionRate: number;
  activeUsers: number;
}

// Metadata for papers with minimal info
export interface ExamPaperMetadata {
  id: number | string;
  title: string;
  description: string;
  difficulty: string;
  topics_covered: string[]; // Matches the backend tags field
  total_questions: number;
  time_limit: number; // in minutes
  is_premium: boolean;
  price: number;
  purchased?: boolean;
  source: string; // 'model', 'past', 'subject', 'practice'
}

// Component props interfaces
export interface ExamPaperCardProps {
  paper: ExamPaperMetadata;
  progress?: ExamPaperProgress;
  onStart: (paper: ExamPaperMetadata) => void;
}

export interface ExamPaperProgress {
  completed: boolean;
  score?: number;
  bestScore?: number;
  lastAttempted?: string;
  attempts?: number;
}