/**
 * Exam API Endpoints Constants
 * 
 * This module defines all API endpoints for exam-related operations.
 * Using constants prevents typos and makes endpoint changes easier to manage.
 */

const BASE_URL = '/api/v1/exams';

/**
 * Exam API Endpoints
 */
export const EXAM_ENDPOINTS = {
  // Standard CRUD endpoints
  list: `${BASE_URL}`,
  create: `${BASE_URL}`,
  detail: `${BASE_URL}/:id`,
  update: `${BASE_URL}/:id`,
  patch: `${BASE_URL}/:id`,
  delete: `${BASE_URL}/:id`,
  
  // Read endpoints - lists
  published: `${BASE_URL}/published`,
  byStatus: `${BASE_URL}/status/:status`,
  
  // Read endpoints - details
  questions: `${BASE_URL}/:examId/questions`,
  
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
  deleteQuestion: `${BASE_URL}/:examId/questions/:questionId`,
  uploadJson: `${BASE_URL}/upload-json`,
};

// Paper-specific endpoints
export const PAPER_ENDPOINTS = {
  ...EXAM_ENDPOINTS,
  list: EXAM_ENDPOINTS.papers,
  detail: EXAM_ENDPOINTS.paperDetail,
  model: EXAM_ENDPOINTS.modelPapers,
  past: EXAM_ENDPOINTS.pastPapers,
  subject: EXAM_ENDPOINTS.subjectPapers,
  practice: EXAM_ENDPOINTS.practicePapers,
};

// Attempt-specific endpoints
export const ATTEMPT_ENDPOINTS = {
  list: EXAM_ENDPOINTS.userAttempts,
  detail: EXAM_ENDPOINTS.attemptDetail,
  result: EXAM_ENDPOINTS.attemptResult,
  flags: EXAM_ENDPOINTS.flaggedQuestions,
  byExam: EXAM_ENDPOINTS.attemptsByExam,
  submit: EXAM_ENDPOINTS.submitExam,
  answer: EXAM_ENDPOINTS.answerQuestion,
  flag: EXAM_ENDPOINTS.flagQuestion,
  unflag: EXAM_ENDPOINTS.unflagQuestion,
  start: EXAM_ENDPOINTS.startExam,
};

export default EXAM_ENDPOINTS;
