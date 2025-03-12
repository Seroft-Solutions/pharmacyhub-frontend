/**
 * Adapters for converting between backend and frontend models
 */

import {
  Exam,
  ExamPaper,
  ExamPaperMetadata,
  ExamStatus,
  ExamResult,
  Question,
  Option,
  Difficulty,
  PaperType
} from '../model/standardTypes';

/**
 * Backend response types
 */
export interface BackendExamPaper {
  id: string | number;
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
  type: string;
  examId?: number;
}

export interface BackendExam {
  id: number;
  title: string;
  description: string;
  duration: number;
  totalMarks: number;
  passingMarks: number;
  status: string;
  questions?: {
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

/**
 * Adapter functions
 */

/**
 * Convert backend exam paper to frontend model
 */
export function adaptBackendExamPaper(backendPaper: BackendExamPaper): ExamPaper {
  return {
    id: backendPaper.id,
    title: backendPaper.title,
    description: backendPaper.description,
    difficulty: backendPaper.difficulty.toLowerCase() as keyof typeof Difficulty,
    questionCount: backendPaper.questionCount,
    durationMinutes: backendPaper.durationMinutes,
    tags: backendPaper.tags || [],
    premium: backendPaper.premium,
    attemptCount: backendPaper.attemptCount || 0,
    successRatePercent: backendPaper.successRatePercent || 0,
    lastUpdatedDate: backendPaper.lastUpdatedDate,
    type: backendPaper.type as keyof typeof PaperType,
    examId: backendPaper.examId
  };
}

/**
 * Convert backend exam paper to frontend metadata model
 */
export function adaptToExamPaperMetadata(backendPaper: BackendExamPaper): ExamPaperMetadata {
  return {
    id: backendPaper.id,
    title: backendPaper.title,
    description: backendPaper.description,
    difficulty: backendPaper.difficulty.toLowerCase(),
    topics_covered: backendPaper.tags || [],
    total_questions: backendPaper.questionCount,
    time_limit: backendPaper.durationMinutes,
    is_premium: backendPaper.premium,
    source: backendPaper.type.toLowerCase() as 'model' | 'past' | 'subject' | 'practice'
  };
}

/**
 * Convert backend exam to frontend model
 */
export function adaptBackendExam(backendExam: BackendExam): Exam {
  return {
    id: backendExam.id,
    title: backendExam.title,
    description: backendExam.description,
    duration: backendExam.duration,
    totalMarks: backendExam.totalMarks,
    passingMarks: backendExam.passingMarks,
    status: mapBackendStatus(backendExam.status),
    questions: backendExam.questions?.map(adaptBackendQuestion) || []
  };
}

/**
 * Convert backend question to frontend model
 */
export function adaptBackendQuestion(backendQuestion: BackendExam['questions'][0]): Question {
  return {
    id: backendQuestion.id,
    questionNumber: backendQuestion.questionNumber,
    text: backendQuestion.questionText,
    options: backendQuestion.options.map(adaptBackendOption),
    correctAnswer: backendQuestion.correctAnswer,
    explanation: backendQuestion.explanation,
    marks: backendQuestion.marks
  };
}

/**
 * Convert backend option to frontend model
 */
function adaptBackendOption(backendOption: BackendExam['questions'][0]['options'][0]): Option {
  return {
    id: backendOption.id,
    label: backendOption.optionKey,
    text: backendOption.optionText,
    isCorrect: backendOption.isCorrect
  };
}

/**
 * Map backend status to frontend status
 */
function mapBackendStatus(status: string): ExamStatus {
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

/**
 * Convert mock data to frontend models
 * This is used for development only
 */
export function adaptMockExamPaper(mockPaper: any): ExamPaper {
  return {
    id: mockPaper.id || `mock-${Date.now()}`,
    title: mockPaper.title,
    description: mockPaper.description || '',
    difficulty: (mockPaper.difficulty || 'medium').toLowerCase() as keyof typeof Difficulty,
    questionCount: mockPaper.totalQuestions || 0,
    durationMinutes: mockPaper.duration || 0,
    tags: mockPaper.topics || [],
    premium: mockPaper.isPremium || false,
    attemptCount: mockPaper.attempts || 0,
    successRatePercent: mockPaper.successRate || 0,
    lastUpdatedDate: mockPaper.lastUpdated || new Date().toISOString().split('T')[0],
    type: (mockPaper.source || 'MODEL').toUpperCase() as keyof typeof PaperType
  };
}

/**
 * Convert mock data to frontend metadata
 * This is used for development only
 */
export function adaptMockToMetadata(mockPaper: any): ExamPaperMetadata {
  return {
    id: mockPaper.id || `mock-${Date.now()}`,
    title: mockPaper.title,
    description: mockPaper.description || '',
    difficulty: (mockPaper.difficulty || 'medium').toLowerCase(),
    topics_covered: mockPaper.topics || [],
    total_questions: mockPaper.totalQuestions || 0,
    time_limit: mockPaper.duration || 0,
    is_premium: mockPaper.isPremium || false,
    source: mockPaper.source || 'model'
  };
}