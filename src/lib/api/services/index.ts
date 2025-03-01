/**
 * Centralized services export file
 * 
 * This file exports all API services to make imports cleaner
 * throughout the application.
 */

export { default as authService } from './authService';
export type { 
  LoginRequest,
  RegisterRequest,
  AuthTokens,
  AuthResponse
} from './authService';

export { default as userService } from './userService';
export type {
  User,
  UserProfileUpdateData,
  PasswordChangeRequest
} from './userService';

export { default as examService } from './examService';
export type {
  Exam,
  ExamQuestion,
  ExamSubmission,
  ExamResult,
  ExamFilters
} from './examService';

export { default as progressService } from './progressService';
export type {
  Progress,
  ProgressUpdateData,
  QuestionAttempt,
  ProgressStatistics
} from './progressService';

// Include factory functions to create custom services
export { createApiService, createExtendedApiService } from '../createService';
export type { ApiService } from '../createService';
