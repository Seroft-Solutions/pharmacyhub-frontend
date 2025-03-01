/**
 * Unified API Module
 * 
 * This module exports all of the exam-related API functionality
 * in an organized, consistent way.
 */

// Export core API client, service, and query keys
export * from './core';

// Export hooks for React components
export * from './hooks';

// Export adapter functions for backend data
export * from './adapter';

// Export types from the model
export type {
  Exam,
  ExamAttempt,
  ExamResult,
  FlaggedQuestion,
  Question,
  UserAnswer
} from '../model/mcqTypes';
