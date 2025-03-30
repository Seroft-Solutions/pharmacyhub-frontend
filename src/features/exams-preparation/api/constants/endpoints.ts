/**
 * Exam API Endpoints Constants
 * 
 * This module defines all API endpoints for exam-related operations
 * using the core endpoint utilities.
 */
import { createEndpoints } from '@/core/api/utils';

const BASE_URL = '/api/v1/exams-preparation';

/**
 * Create exam endpoints using core factory
 */
export const API_ENDPOINTS = {
  BASE: BASE_URL,
  
  // CRUD operations
  EXAMS: `${BASE_URL}`,
  EXAM: (id: number) => `${BASE_URL}/${id}`,
  
  // Custom endpoints
  PUBLISHED: `${BASE_URL}/published`,
  BY_STATUS: (status: string) => `${BASE_URL}/status/${status}`,
  
  // Exam operations
  PUBLISH: (id: number) => `${BASE_URL}/${id}/publish`,
  ARCHIVE: (id: number) => `${BASE_URL}/${id}/archive`,
  
  // Questions
  QUESTIONS: (examId: number) => `${BASE_URL}/${examId}/questions`,
  QUESTION_BY_ID: (examId: number, questionId: number) => 
    `${BASE_URL}/${examId}/questions/${questionId}`,
  
  // Stats
  STATS: `${BASE_URL}/stats`,
  
  // Attempts
  START_EXAM: (id: number) => `${BASE_URL}/${id}/start`,
  SUBMIT_EXAM: (attemptId: number) => `${BASE_URL}/attempts/${attemptId}/submit`,
  SAVE_ANSWER: (attemptId: number, questionId: number) => 
    `${BASE_URL}/attempts/${attemptId}/answer/${questionId}`,
  FLAG_QUESTION: (attemptId: number, questionId: number) => 
    `${BASE_URL}/attempts/${attemptId}/flag/${questionId}`,
  
  // Attempts resource
  ATTEMPTS: `${BASE_URL}/attempts`,
  ATTEMPT: (id: number) => `${BASE_URL}/attempts/${id}`,
  EXAM_ATTEMPTS: (examId: number) => `${BASE_URL}/${examId}/attempts`,
  ATTEMPT_RESULT: (attemptId: number) => `${BASE_URL}/attempts/${attemptId}/result`,
  
  // Papers resource
  PAPERS: `${BASE_URL}/papers`,
  PAPER: (id: number) => `${BASE_URL}/papers/${id}`,
  MODEL_PAPERS: `${BASE_URL}/papers/model`,
  PAST_PAPERS: `${BASE_URL}/papers/past`,
  SUBJECT_PAPERS: `${BASE_URL}/papers/subject`,
  PRACTICE_PAPERS: `${BASE_URL}/papers/practice`,
  UPLOAD_JSON: `${BASE_URL}/papers/upload/json`,
};

export default API_ENDPOINTS;
