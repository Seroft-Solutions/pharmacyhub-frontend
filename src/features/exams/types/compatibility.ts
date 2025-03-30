/**
 * Compatibility Types for Exams Feature
 * 
 * This file re-exports types from the new exams-preparation feature
 * to provide backward compatibility for code that imports from the
 * old exams feature types.
 * 
 * DEPRECATION NOTICE: This file is temporary and will be removed
 * once all code has been updated to import directly from the new
 * exams-preparation feature.
 */

// Re-export all types from exams-preparation
export * from '@/features/exams-preparation/types';

// Log a warning when types from this file are used
if (process.env.NODE_ENV === 'development') {
  console.warn(
    'WARNING: You are using deprecated types from @/features/exams/types. ' +
    'Please update your imports to use @/features/exams-preparation/types instead.'
  );
}
