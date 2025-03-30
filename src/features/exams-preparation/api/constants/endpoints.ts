/**
 * Exam API Endpoints Constants
 * 
 * This module defines all API endpoints for exam-related operations.
 */

const BASE_URL = '/api/v1/exams-preparation';

/**
 * Exam API Endpoints
 */
export const EXAM_ENDPOINTS = {
  // Base endpoint
  base: `${BASE_URL}`,
  
  // CRUD operations
  all: `${BASE_URL}`,
  byId: `${BASE_URL}/:id`,
  create: `${BASE_URL}`,
  update: `${BASE_URL}/:id`,
  patch: `${BASE_URL}/:id`,
  delete: `${BASE_URL}/:id`,
  
  // Custom endpoints
  published: `${BASE_URL}/published`,
  byStatus: `${BASE_URL}/status/:status`,
  getExamById: `${BASE_URL}/:examId`,
  
  // Exam operations
  publishExam: `${BASE_URL}/:id/publish`,
  archiveExam: `${BASE_URL}/:id/archive`,
  
  // Questions
  questions: `${BASE_URL}/:examId/questions`,
  getExamQuestions: `${BASE_URL}/:examId/questions`,
  updateQuestion: `${BASE_URL}/:examId/questions/:questionId`,
  deleteQuestion: `${BASE_URL}/:examId/questions/:questionId`,
  
  // Stats
  examStats: `${BASE_URL}/stats`,
  
  // Attempts
  startExam: `${BASE_URL}/:id/start`,
  submitExam: `${BASE_URL}/attempts/:id/submit`,
  saveAnswer: `${BASE_URL}/attempts/:attemptId/answer/:questionId`,
  flagQuestion: `${BASE_URL}/attempts/:attemptId/flag/:questionId`,
};

/**
 * Attempt API Endpoints
 */
export const ATTEMPT_ENDPOINTS = {
  // Base endpoint
  base: `${BASE_URL}/attempts`,
  
  // CRUD operations
  all: `${BASE_URL}/attempts`,
  byId: `${BASE_URL}/attempts/:id`,
  create: `${BASE_URL}/attempts`,
  update: `${BASE_URL}/attempts/:id`,
  delete: `${BASE_URL}/attempts/:id`,
  
  // Custom endpoints
  byExam: `${BASE_URL}/:id/attempts`,
  start: `${BASE_URL}/:id/start`,
  submit: `${BASE_URL}/attempts/:id/submit`,
  result: `${BASE_URL}/attempts/:id/result`,
  flags: `${BASE_URL}/attempts/:id/flags`,
  answer: `${BASE_URL}/attempts/:attemptId/answer/:questionId`,
  flag: `${BASE_URL}/attempts/:attemptId/flag/:questionId`,
  unflag: `${BASE_URL}/attempts/:attemptId/flag/:questionId`,
};

/**
 * Paper API Endpoints
 */
export const PAPER_ENDPOINTS = {
  // Base endpoint
  base: `${BASE_URL}/papers`,
  
  // CRUD operations
  all: `${BASE_URL}/papers`,
  byId: `${BASE_URL}/papers/:id`,
  create: `${BASE_URL}/papers`,
  update: `${BASE_URL}/papers/:id`,
  patch: `${BASE_URL}/papers/:id`,
  delete: `${BASE_URL}/papers/:id`,
  
  // Paper types
  model: `${BASE_URL}/papers/model`,
  past: `${BASE_URL}/papers/past`,
  subject: `${BASE_URL}/papers/subject`,
  practice: `${BASE_URL}/papers/practice`,
  
  // Actions
  uploadJson: `${BASE_URL}/papers/upload/json`,
};

export default { EXAM_ENDPOINTS, ATTEMPT_ENDPOINTS, PAPER_ENDPOINTS };