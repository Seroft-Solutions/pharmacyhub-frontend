/**
 * Exam API Services
 * 
 * This module exports all services for interacting with exam-related APIs.
 */

// Export all services
export * from './examApiService';
export * from './examStoreAdapter';
export * from './jsonExamUploadService';

// Re-export for backward compatibility
export { examApiService as examService } from './examApiService';
