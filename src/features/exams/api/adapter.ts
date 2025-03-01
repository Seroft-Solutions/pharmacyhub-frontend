import {
  Exam,
  ExamOption,
  ExamPaper,
  ExamPaperMetadata,
  ExamQuestion,
  ExamStatus,
  ExamStatusType
} from '../types';

// Define the backend API response types
export interface BackendExamPaper {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  questionCount: number;
  durationMinutes: number;
  tags: string[];
  premium: boolean;
  attemptCount: number;
  successRatePercent: number;
  lastUpdatedDate: string;
  type: 'MODEL' | 'PAST';
}

export interface BackendExam {
  id: number;
  title: string;
  description: string;
  duration: number;
  totalMarks: number;
  passingMarks: number;
  status: string;
  questions: {
    id: number;
    questionNumber: number;
    questionText: string;
    options: {
      id: number;
      optionKey: string;
      optionText: string;
      isCorrect: boolean;
    }[];
    correctAnswer: string;
    explanation: string;
    marks: number;
  }[];
}

export interface BackendExamQuestion {
  id: number;
  text: string;
  options: BackendExamOption[];
  explanation: string;
  maxPoints: number;
}

export interface BackendExamOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

// Adapter functions
export function adaptBackendExamPaper(backendPaper: BackendExamPaper): ExamPaper {
  return {
    id: backendPaper.id,
    title: backendPaper.title,
    description: backendPaper.description,
    difficulty: backendPaper.difficulty as 'easy' | 'medium' | 'hard',
    totalQuestions: backendPaper.questionCount,
    duration: backendPaper.durationMinutes,
    topics: backendPaper.tags,
    isPremium: backendPaper.premium,
    attempts: backendPaper.attemptCount,
    successRate: backendPaper.successRatePercent,
    lastUpdated: backendPaper.lastUpdatedDate,
    source: backendPaper.type.toLowerCase() as 'model' | 'past'
  };
}

export function adaptToExamPaperMetadata(backendPaper: BackendExamPaper): ExamPaperMetadata {
  return {
    id: backendPaper.id,
    title: backendPaper.title,
    description: backendPaper.description,
    difficulty: backendPaper.difficulty as 'easy' | 'medium' | 'hard',
    topics_covered: backendPaper.tags,
    total_questions: backendPaper.questionCount,
    time_limit: backendPaper.durationMinutes,
    is_premium: backendPaper.premium,
    source: backendPaper.type.toLowerCase() as 'model' | 'past'
  };
}

export function adaptBackendExam(backendExam: BackendExam): Exam {
  return {
    id: backendExam.id,
    title: backendExam.title,
    description: backendExam.description,
    duration: backendExam.duration,
    maxScore: backendExam.totalMarks,
    passingScore: backendExam.passingMarks,
    status: mapBackendStatus(backendExam.status),
    questions: backendExam.questions.map(q => ({
      id: q.id,
      text: q.questionText,
      options: q.options.map(o => ({
        id: o.id.toString(),
        text: o.optionText,
        key: o.optionKey,
        isCorrect: o.isCorrect
      })),
      explanation: q.explanation,
      points: q.marks
    }))
  };
}

export function adaptBackendQuestion(backendQuestion: BackendExamQuestion): ExamQuestion {
  return {
    id: backendQuestion.id,
    text: backendQuestion.text,
    options: backendQuestion.options.map(adaptBackendOption),
    explanation: backendQuestion.explanation,
    points: backendQuestion.maxPoints
  };
}

function adaptBackendOption(backendOption: BackendExamOption): ExamOption {
  return {
    id: backendOption.id,
    text: backendOption.text,
    isCorrect: backendOption.isCorrect
  };
}

function mapBackendStatus(status: string): ExamStatusType {
  switch (status.toUpperCase()) {
    case 'DRAFT':
      return ExamStatus.DRAFT;
    case 'PUBLISHED':
      return ExamStatus.PUBLISHED;
    case 'ARCHIVED':
      return ExamStatus.ARCHIVED;
    default:
      return ExamStatus.DRAFT;
  }
}
