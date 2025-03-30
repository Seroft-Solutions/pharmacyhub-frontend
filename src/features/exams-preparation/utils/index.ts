/**
 * Main exports for exams preparation utilities
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
