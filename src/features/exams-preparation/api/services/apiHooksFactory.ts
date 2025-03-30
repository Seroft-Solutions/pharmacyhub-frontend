/**
 * Exams API Hooks Factory
 * 
 * This module creates standardized API hooks for the Exams feature
 * using the core API hooks factory.
 */
import { createApiHooks } from '@/core/api/services/factories';
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
  id: number;
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
    requiresAuth: true
  }
);

/**
 * API hooks for papers (subset of exams)
 */
export const papersApiHooks = createApiHooks<any, any, any, any>(
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
    requiresAuth: true
  }
);

/**
 * API hooks for exam attempts
 */
export const attemptsApiHooks = createApiHooks<any, any, any, any>(
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
    requiresAuth: true
  }
);

export default {
  exams: examsApiHooks,
  papers: papersApiHooks,
  attempts: attemptsApiHooks
};
