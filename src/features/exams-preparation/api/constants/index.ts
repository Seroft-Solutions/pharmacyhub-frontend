/**
 * API Constants for Exams Preparation
 * 
 * This module exports constants related to API endpoints and configurations
 * for the exams-preparation feature.
 */

// API endpoint paths
export const API_ENDPOINTS = {
  // Exams
  EXAMS: '/api/v1/exams',
  EXAMS_PUBLISHED: '/api/v1/exams/published',
  EXAM_BY_ID: (id: number | string) => `/api/v1/exams/${id}`,
  
  // Attempts
  ATTEMPTS: '/api/v1/exams/attempts',
  ATTEMPT_BY_ID: (id: number | string) => `/api/v1/exams/attempts/${id}`,
  START_ATTEMPT: (examId: number | string) => `/api/v1/exams/${examId}/start`,
  SUBMIT_ATTEMPT: (attemptId: number | string) => `/api/v1/exams/attempts/${attemptId}/submit`,
  
  // Questions
  QUESTIONS: (examId: number | string) => `/api/v1/exams/${examId}/questions`,
  QUESTION_BY_ID: (examId: number | string, questionId: number | string) => 
    `/api/v1/exams/${examId}/questions/${questionId}`,
  ANSWER_QUESTION: (attemptId: number | string, questionId: number | string) => 
    `/api/v1/exams/attempts/${attemptId}/answer/${questionId}`,
  FLAG_QUESTION: (attemptId: number | string, questionId: number | string) => 
    `/api/v1/exams/attempts/${attemptId}/flag/${questionId}`,
  
  // Results
  RESULTS: '/api/v1/exams/results',
  RESULT_BY_ATTEMPT: (attemptId: number | string) => `/api/v1/exams/results/${attemptId}`,
  
  // Payments
  PAYMENTS: '/api/v1/payments',
  PAYMENT_BY_ID: (id: number | string) => `/api/v1/payments/${id}`,
  PAYMENT_STATUS: (examId: number | string) => `/api/v1/payments/status/${examId}`,
  PAYMENT_CHECKOUT: (examId: number | string) => `/api/v1/payments/checkout/${examId}`,
};

// API request options
export const REQUEST_OPTIONS = {
  // Default timeouts
  DEFAULT_TIMEOUT: 15000, // 15 seconds
  EXTENDED_TIMEOUT: 30000, // 30 seconds
  
  // Content types
  CONTENT_TYPE_JSON: 'application/json',
  CONTENT_TYPE_FORM: 'application/x-www-form-urlencoded',
};

// Pagination defaults
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 50,
};
