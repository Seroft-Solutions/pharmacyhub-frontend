/**
 * Exam API Endpoints Constants
 * 
 * This module defines all API endpoints for exam-related operations
 * using the core endpoint utilities.
 */
import { createEndpoints } from '@/core/api/utils/endpointUtils';

// Base API path for exams
const EXAMS_BASE_PATH = 'v1/exams-preparation';

/**
 * Create exam endpoints using core factory
 */
export const API_ENDPOINTS = createEndpoints(EXAMS_BASE_PATH, {
  // Custom endpoints for exams
  PUBLISHED: (suffix = '') => `${EXAMS_BASE_PATH}/published${suffix}`,
  BY_STATUS: (status: string) => `${EXAMS_BASE_PATH}/status/${status}`,
  
  // Exam operations
  PUBLISH: (id: number) => `${EXAMS_BASE_PATH}/${id}/publish`,
  ARCHIVE: (id: number) => `${EXAMS_BASE_PATH}/${id}/archive`,
  
  // Questions
  QUESTIONS: (examId: number) => `${EXAMS_BASE_PATH}/${examId}/questions`,
  QUESTION_BY_ID: (examId: number, questionId: number) => 
    `${EXAMS_BASE_PATH}/${examId}/questions/${questionId}`,
  
  // Stats
  STATS: `${EXAMS_BASE_PATH}/stats`,
  
  // Attempts
  START_EXAM: (id: number) => `${EXAMS_BASE_PATH}/${id}/start`,
  SUBMIT_EXAM: (attemptId: number) => `${EXAMS_BASE_PATH}/attempts/${attemptId}/submit`,
  SAVE_ANSWER: (attemptId: number, questionId: number) => 
    `${EXAMS_BASE_PATH}/attempts/${attemptId}/answer/${questionId}`,
  FLAG_QUESTION: (attemptId: number, questionId: number) => 
    `${EXAMS_BASE_PATH}/attempts/${attemptId}/flag/${questionId}`,
  
  // Attempts resource
  ATTEMPTS: `${EXAMS_BASE_PATH}/attempts`,
  ATTEMPT: (id: number) => `${EXAMS_BASE_PATH}/attempts/${id}`,
  EXAM_ATTEMPTS: (examId: number) => `${EXAMS_BASE_PATH}/${examId}/attempts`,
  ATTEMPT_RESULT: (attemptId: number) => `${EXAMS_BASE_PATH}/attempts/${attemptId}/result`,
});

// Base path for papers
const PAPERS_BASE_PATH = `${EXAMS_BASE_PATH}/papers`;

/**
 * Paper-specific endpoints using core factory
 */
export const PAPER_ENDPOINTS = createEndpoints(PAPERS_BASE_PATH, {
  // Paper types
  MODEL: `${PAPERS_BASE_PATH}/model`,
  PAST: `${PAPERS_BASE_PATH}/past`,
  SUBJECT: `${PAPERS_BASE_PATH}/subject`,
  PRACTICE: `${PAPERS_BASE_PATH}/practice`,
  
  // Actions
  UPLOAD_JSON: `${PAPERS_BASE_PATH}/upload/json`,
});

/**
 * Export all endpoints in a single object for convenience
 */
export const ENDPOINTS = {
  ...API_ENDPOINTS,
  PAPERS: PAPER_ENDPOINTS,
};

export default ENDPOINTS;
