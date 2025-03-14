/**
 * Exam API Endpoints
 * 
 * This module defines all API endpoints for exam-related operations.
 * Using constants prevents typos and makes endpoint changes easier to manage.
 */

const BASE_URL = '/api/v1/exams';

export const EXAM_ENDPOINTS = {
  // Exam CRUD operations
  list: BASE_URL,
  create: BASE_URL,
  detail: `${BASE_URL}/:id`,
  update: `${BASE_URL}/:id`,
  patch: `${BASE_URL}/:id`,
  delete: `${BASE_URL}/:id`,
  
  // Read endpoints - lists
  published: `${BASE_URL}/published`,
  byStatus: `${BASE_URL}/status/:status`,
  
  // Read endpoints - details
  questions: `${BASE_URL}/:id/questions`,
  
  // Read endpoints - user attempts
  userAttempts: `${BASE_URL}/attempts/user`,
  attemptsByExam: `${BASE_URL}/:id/attempts`,
  attemptDetail: `${BASE_URL}/attempts/:id`,
  attemptResult: `${BASE_URL}/attempts/:id/result`,
  flaggedQuestions: `${BASE_URL}/attempts/:id/flags`,
  examStats: `${BASE_URL}/stats`,
  
  // Paper endpoints
  papers: `${BASE_URL}/papers`,
  modelPapers: `${BASE_URL}/papers/model`,
  pastPapers: `${BASE_URL}/papers/past`,
  subjectPapers: `${BASE_URL}/papers/subject`,
  practicePapers: `${BASE_URL}/papers/practice`,
  paperDetail: `${BASE_URL}/papers/:id`,
  
  // Action endpoints
  startExam: `${BASE_URL}/:id/start`,
  answerQuestion: `${BASE_URL}/attempts/:attemptId/answer/:questionId`,
  flagQuestion: `${BASE_URL}/attempts/:attemptId/flag/:questionId`,
  unflagQuestion: `${BASE_URL}/attempts/:attemptId/flag/:questionId`,
  submitExam: `${BASE_URL}/attempts/:id/submit`,
  publishExam: `${BASE_URL}/:id/publish`,
  archiveExam: `${BASE_URL}/:id/archive`,
  updateQuestion: `${BASE_URL}/:examId/questions/:questionId`,
  uploadJson: `${BASE_URL}/upload-json`,
};

export default EXAM_ENDPOINTS;
