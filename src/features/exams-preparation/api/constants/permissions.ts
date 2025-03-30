/**
 * Exam Permissions Constants
 * 
 * This module defines all permission constants for the exams-preparation feature.
 * Using constants prevents typos and makes permission changes easier to manage.
 */

/**
 * Exam feature operation permissions
 */
export const EXAM_PERMISSIONS = {
  // View permissions
  VIEW: 'exams-preparation:view',
  VIEW_DETAILS: 'exams-preparation:view-details',
  VIEW_RESULTS: 'exams-preparation:view-results',
  
  // Create/Edit permissions
  CREATE: 'exams-preparation:create',
  EDIT: 'exams-preparation:edit',
  DELETE: 'exams-preparation:delete',
  
  // Management permissions
  PUBLISH: 'exams-preparation:publish',
  ARCHIVE: 'exams-preparation:archive',
  
  // Question management
  EDIT_QUESTIONS: 'exams-preparation:edit-questions',
  
  // Attempt permissions
  TAKE_EXAM: 'exams-preparation:take',
};

/**
 * Paper-specific permissions
 */
export const PAPER_PERMISSIONS = {
  VIEW_ALL: 'papers:view',
  VIEW_MODEL: 'papers:view-model',
  VIEW_PAST: 'papers:view-past',
  VIEW_SUBJECT: 'papers:view-subject',
  VIEW_PRACTICE: 'papers:view-practice',
  CREATE: 'papers:create',
  EDIT: 'papers:edit',
  DELETE: 'papers:delete',
  MANAGE: 'papers:manage',
  UPLOAD: 'papers:upload',
};

/**
 * Attempt-specific permissions
 */
export const ATTEMPT_PERMISSIONS = {
  VIEW: 'attempts:view',
  VIEW_OWN: 'attempts:view-own',
  START: 'attempts:start',
  SUBMIT: 'attempts:submit',
  FLAG: 'attempts:flag',
  ANSWER: 'attempts:answer',
  VIEW_RESULTS: 'attempts:view-results',
};

/**
 * Question-specific permissions
 */
export const QUESTION_PERMISSIONS = {
  VIEW: 'questions:view',
  CREATE: 'questions:create',
  EDIT: 'questions:edit',
  DELETE: 'questions:delete',
};

/**
 * Combined permissions object for easy access
 */
export const EXAM_FEATURE_PERMISSIONS = {
  EXAMS: EXAM_PERMISSIONS,
  PAPERS: PAPER_PERMISSIONS, 
  ATTEMPTS: ATTEMPT_PERMISSIONS,
  QUESTIONS: QUESTION_PERMISSIONS,
};

export default EXAM_FEATURE_PERMISSIONS;