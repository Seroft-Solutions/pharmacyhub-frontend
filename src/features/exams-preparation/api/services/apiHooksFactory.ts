/**
 * Exams API Hooks Factory
 * 
 * This module creates standardized API hooks for the Exams feature
 * using the core API hooks factory.
 */
import { createApiHooks } from '@/core/api/services/factories';
import { handleApiError } from '@/core/api/core/error';
import { ENDPOINTS } from '../constants';
import { Exam, ExamStatus } from '../../types';

/**
 * Filter parameters for exam lists
 */
export interface ExamListParams {
  page?: number;
  limit?: number;
  status?: ExamStatus;
  search?: string;
  sortBy?: string;
  sortDir?: 'asc' | 'desc';
}

/**
 * Parameters for creating a new exam
 */
export interface ExamCreateParams {
  title: string;
  description?: string;
  duration?: number;
  isPremium?: boolean;
  price?: number;
  status?: ExamStatus;
  [key: string]: any;
}

/**
 * Parameters for updating an exam
 */
export interface ExamUpdateParams {
  title?: string;
  description?: string;
  duration?: number;
  isPremium?: boolean;
  price?: number;
  status?: ExamStatus;
  [key: string]: any;
}

/**
 * API hooks for exams
 */
export const examsApiHooks = createApiHooks<Exam, ExamListParams, ExamCreateParams, ExamUpdateParams>(
  {
    // Map the CRUD endpoints for exams
    list: ENDPOINTS.LIST,
    detail: ENDPOINTS.DETAIL(':id'),
    create: ENDPOINTS.CREATE,
    update: ENDPOINTS.UPDATE(':id'),
    patch: ENDPOINTS.UPDATE(':id'), // Use same endpoint for PUT and PATCH
    delete: ENDPOINTS.DELETE(':id'),
    
    // Map custom endpoints
    published: ENDPOINTS.PUBLISHED(),
    byStatus: ENDPOINTS.BY_STATUS(':status'),
    publish: ENDPOINTS.PUBLISH(':id'),
    archive: ENDPOINTS.ARCHIVE(':id'),
    stats: ENDPOINTS.STATS,
    questions: ENDPOINTS.QUESTIONS(':examId'),
    question: ENDPOINTS.QUESTION_BY_ID(':examId', ':questionId'),
    startExam: ENDPOINTS.START_EXAM(':id'),
  },
  {
    resourceName: 'exams-preparation',
    defaultStaleTime: 5 * 60 * 1000, // 5 minutes
    requiresAuth: true,
    errorHandler: (error) => handleApiError(error, { context: { feature: 'exams-preparation' }}),
    queryOptions: {
      refetchOnWindowFocus: false,
      retry: 1
    }
  }
);

/**
 * Interface for paper-related data
 */
export interface Paper {
  id: number;
  title: string;
  description?: string;
  type: 'model' | 'past' | 'subject' | 'practice';
  year?: number;
  subject?: string;
  isPremium: boolean;
  price?: number;
  duration: number;
  questionCount: number;
  [key: string]: any;
}

/**
 * Parameters for paper lists
 */
export interface PaperListParams {
  page?: number;
  limit?: number;
  type?: string;
  subject?: string;
  year?: number;
  search?: string;
  sortBy?: string;
  sortDir?: 'asc' | 'desc';
}

/**
 * Parameters for creating a new paper
 */
export interface PaperCreateParams {
  title: string;
  description?: string;
  type: 'model' | 'past' | 'subject' | 'practice';
  year?: number;
  subject?: string;
  isPremium?: boolean;
  price?: number;
  duration: number;
  [key: string]: any;
}

/**
 * API hooks for papers (subset of exams)
 */
export const papersApiHooks = createApiHooks<Paper, PaperListParams, PaperCreateParams, Partial<PaperCreateParams>>(
  {
    // Map the CRUD endpoints for papers
    list: ENDPOINTS.PAPERS.LIST,
    detail: ENDPOINTS.PAPERS.DETAIL(':id'),
    create: ENDPOINTS.PAPERS.CREATE,
    update: ENDPOINTS.PAPERS.UPDATE(':id'),
    patch: ENDPOINTS.PAPERS.UPDATE(':id'), // Use same endpoint for PUT and PATCH
    delete: ENDPOINTS.PAPERS.DELETE(':id'),
    
    // Map custom endpoints
    model: ENDPOINTS.PAPERS.MODEL,
    past: ENDPOINTS.PAPERS.PAST,
    subject: ENDPOINTS.PAPERS.SUBJECT,
    practice: ENDPOINTS.PAPERS.PRACTICE,
    uploadJson: ENDPOINTS.PAPERS.UPLOAD_JSON,
  },
  {
    resourceName: 'exams-preparation-papers',
    defaultStaleTime: 10 * 60 * 1000, // 10 minutes (longer for papers)
    requiresAuth: true,
    errorHandler: (error) => handleApiError(error, { context: { feature: 'exams-preparation-papers' }}),
    queryOptions: {
      refetchOnWindowFocus: false,
      retry: 1
    }
  }
);

/**
 * Interface for exam attempt data
 */
export interface ExamAttempt {
  id: number;
  examId: number;
  userId: number;
  startTime: string;
  endTime?: string;
  duration: number;
  status: 'in_progress' | 'completed' | 'abandoned';
  score?: number;
  maxScore?: number;
  percentageScore?: number;
  questionsAttempted?: number;
  totalQuestions: number;
  answers?: Record<string, any>[];
  [key: string]: any;
}

/**
 * Parameters for attempt lists
 */
export interface AttemptListParams {
  page?: number;
  limit?: number;
  examId?: number;
  userId?: number;
  status?: string;
  sortBy?: string;
  sortDir?: 'asc' | 'desc';
}

/**
 * Parameters for creating a new attempt
 */
export interface AttemptCreateParams {
  examId: number;
}

/**
 * API hooks for exam attempts
 */
export const attemptsApiHooks = createApiHooks<ExamAttempt, AttemptListParams, AttemptCreateParams, Partial<ExamAttempt>>(
  {
    // Map the CRUD endpoints for attempts
    list: ENDPOINTS.ATTEMPTS,
    detail: ENDPOINTS.ATTEMPT(':id'),
    create: ENDPOINTS.ATTEMPTS,
    update: ENDPOINTS.ATTEMPT(':id'),
    delete: ENDPOINTS.ATTEMPT(':id'),
    
    // Map custom endpoints
    byExam: ENDPOINTS.EXAM_ATTEMPTS(':examId'),
    result: ENDPOINTS.ATTEMPT_RESULT(':attemptId'),
    submit: ENDPOINTS.SUBMIT_EXAM(':attemptId'),
    saveAnswer: ENDPOINTS.SAVE_ANSWER(':attemptId', ':questionId'),
    flagQuestion: ENDPOINTS.FLAG_QUESTION(':attemptId', ':questionId'),
  },
  {
    resourceName: 'exams-preparation-attempts',
    defaultStaleTime: 1 * 60 * 1000, // 1 minute (shorter for attempts)
    requiresAuth: true,
    errorHandler: (error) => handleApiError(error, { context: { feature: 'exams-preparation-attempts' }}),
    queryOptions: {
      refetchOnWindowFocus: true, // More frequently check for attempt updates
      retry: 2
    }
  }
);

export default {
  exams: examsApiHooks,
  papers: papersApiHooks,
  attempts: attemptsApiHooks
};
