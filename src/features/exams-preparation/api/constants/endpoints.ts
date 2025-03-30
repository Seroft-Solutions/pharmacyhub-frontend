/**
 * Exams Preparation API Endpoints
 * 
 * This module defines API endpoints for the exams-preparation feature
 * using the core API endpoint factory for consistency.
 */
import { createEndpoints } from '@/core/api/utils/endpointUtils';

/**
 * Base API endpoints for the exams-preparation feature
 */
export const EXAM_ENDPOINTS = createEndpoints('v1/exams-preparation', {
  // Exam-specific endpoints
  PUBLISHED: `${createEndpoints('v1/exams-preparation').BASE}/published`,
  BY_STATUS: (status: string) => `${createEndpoints('v1/exams-preparation').BASE}/status/${status}`,
  
  // Question-related endpoints
  QUESTIONS: (examId: number) => `${createEndpoints('v1/exams-preparation').BASE}/${examId}/questions`,
  QUESTION_DETAIL: (examId: number, questionId: number) => 
    `${createEndpoints('v1/exams-preparation').BASE}/${examId}/questions/${questionId}`,
  
  // Attempt-related endpoints
  ATTEMPTS: (examId: number) => `${createEndpoints('v1/exams-preparation').BASE}/${examId}/attempts`,
  ATTEMPT_DETAIL: (attemptId: string) => `${createEndpoints('v1/exams-preparation').BASE}/attempts/${attemptId}`,
  START_ATTEMPT: (examId: number) => `${createEndpoints('v1/exams-preparation').BASE}/${examId}/attempts/start`,
  SUBMIT_ATTEMPT: (attemptId: string) => `${createEndpoints('v1/exams-preparation').BASE}/attempts/${attemptId}/submit`,
  
  // Result-related endpoints
  RESULTS: (attemptId: string) => `${createEndpoints('v1/exams-preparation').BASE}/attempts/${attemptId}/results`,
  
  // Paper-related endpoints
  PAPERS: `${createEndpoints('v1/exams-preparation').BASE}/papers`,
  PAPER_DETAIL: (paperId: number) => `${createEndpoints('v1/exams-preparation').BASE}/papers/${paperId}`,
  
  // Payment-related endpoints
  PAYMENT_INTENT: (examId: number) => `${createEndpoints('v1/exams-preparation').BASE}/${examId}/payment/intent`,
  CONFIRM_PAYMENT: (examId: number) => `${createEndpoints('v1/exams-preparation').BASE}/${examId}/payment/confirm`,
  
  // Stats-related endpoints
  STATS: `${createEndpoints('v1/exams-preparation').BASE}/stats`,
});

/**
 * Export specific endpoint groups for easier access
 */
export const QUESTION_ENDPOINTS = {
  LIST: (examId: number) => EXAM_ENDPOINTS.QUESTIONS(examId),
  DETAIL: (examId: number, questionId: number) => EXAM_ENDPOINTS.QUESTION_DETAIL(examId, questionId),
  CREATE: (examId: number) => EXAM_ENDPOINTS.QUESTIONS(examId),
  UPDATE: (examId: number, questionId: number) => EXAM_ENDPOINTS.QUESTION_DETAIL(examId, questionId),
  DELETE: (examId: number, questionId: number) => EXAM_ENDPOINTS.QUESTION_DETAIL(examId, questionId),
};

export const ATTEMPT_ENDPOINTS = {
  LIST: (examId: number) => EXAM_ENDPOINTS.ATTEMPTS(examId),
  DETAIL: (attemptId: string) => EXAM_ENDPOINTS.ATTEMPT_DETAIL(attemptId),
  START: (examId: number) => EXAM_ENDPOINTS.START_ATTEMPT(examId),
  SUBMIT: (attemptId: string) => EXAM_ENDPOINTS.SUBMIT_ATTEMPT(attemptId),
  RESULTS: (attemptId: string) => EXAM_ENDPOINTS.RESULTS(attemptId),
};

export const PAPER_ENDPOINTS = {
  LIST: EXAM_ENDPOINTS.PAPERS,
  DETAIL: (paperId: number) => EXAM_ENDPOINTS.PAPER_DETAIL(paperId),
  CREATE: EXAM_ENDPOINTS.PAPERS,
  UPDATE: (paperId: number) => EXAM_ENDPOINTS.PAPER_DETAIL(paperId),
  DELETE: (paperId: number) => EXAM_ENDPOINTS.PAPER_DETAIL(paperId),
};

export const PAYMENT_ENDPOINTS = {
  CREATE_INTENT: (examId: number) => EXAM_ENDPOINTS.PAYMENT_INTENT(examId),
  CONFIRM: (examId: number) => EXAM_ENDPOINTS.CONFIRM_PAYMENT(examId),
};
