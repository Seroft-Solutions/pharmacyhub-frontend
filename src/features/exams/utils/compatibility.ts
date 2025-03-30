/**
 * Compatibility Utilities for Exams Feature
 * 
 * This file re-exports utilities from the new exams-preparation feature
 * to provide backward compatibility for code that imports from the
 * old exams feature utilities.
 * 
 * DEPRECATION NOTICE: This file is temporary and will be removed
 * once all code has been updated to import directly from the new
 * exams-preparation feature.
 */

// Re-export all utilities from exams-preparation
export * from '@/features/exams-preparation/utils';

// Log a warning when utilities from this file are used
if (process.env.NODE_ENV === 'development') {
  console.warn(
    'WARNING: You are using deprecated utilities from @/features/exams/utils. ' +
    'Please update your imports to use @/features/exams-preparation/utils instead.'
  );
}
