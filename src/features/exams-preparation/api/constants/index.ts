/**
 * API Constants for Exams Preparation
 * 
 * This module exports constants related to API endpoints and configurations
 * for the exams-preparation feature.
 */

// Export endpoints
export { 
  EXAM_ENDPOINTS,
  ATTEMPT_ENDPOINTS,
  PAPER_ENDPOINTS,
} from './endpoints';

// Export request options and pagination constants
export const REQUEST_OPTIONS = {
  // Default timeouts
  DEFAULT_TIMEOUT: 15000, // 15 seconds
  EXTENDED_TIMEOUT: 30000, // 30 seconds
  
  // Content types
  CONTENT_TYPE_JSON: 'application/json',
  CONTENT_TYPE_FORM: 'application/x-www-form-urlencoded',
};

export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 50,
};

// Export permissions
export * from './permissions';
