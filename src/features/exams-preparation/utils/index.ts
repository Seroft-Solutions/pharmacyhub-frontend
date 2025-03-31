/**
 * Main exports for exams preparation utilities
 * 
 * This module exports all utility functions for the exams-preparation feature.
 * It leverages core utilities for cross-cutting concerns and adds exam-specific
 * functionality.
 */

// Time formatting utilities
export { formatTime, formatTimeVerbose } from './formatTime';

// Answer processing utilities
export {
  indexToLabel,
  labelToIndex,
  normalizeToLabel,
  areAnswersEqual,
  findCorrectAnswerLabel,
  getUserSelectedLabel
} from './answerUtils';

// Exam calculation utilities
export {
  calculateExamScore,
  formatExamResult,
  calculateExamStatistics,
  isAnswerCorrect
} from './examCalculator';

// Data mapping utilities
export {
  mapExamResponseToExam,
  mapAttemptResponseToAttempt,
  mapResultResponseToResult,
  mapQuestionOptionsForDisplay
} from './dataMappers';

// Logging utilities
export { default as examLogger } from './logger';

// Testing utilities
export * from './testUtils';
