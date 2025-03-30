/**
 * Exam API enums and constants
 * Contains standardized enum types for exam-related data
 */

/**
 * Exam status types
 */
export enum ExamStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  ARCHIVED = 'ARCHIVED'
}

/**
 * Attempt status types
 */
export enum AttemptStatus {
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  ABANDONED = 'ABANDONED'
}

/**
 * Paper types
 */
export enum PaperType {
  MODEL = 'MODEL',
  PAST = 'PAST',
  SUBJECT = 'SUBJECT',
  PRACTICE = 'PRACTICE'
}

/**
 * Difficulty levels
 */
export enum Difficulty {
  EASY = 'EASY',
  MEDIUM = 'MEDIUM',
  HARD = 'HARD'
}

/**
 * Question types
 */
export enum QuestionType {
  MULTIPLE_CHOICE = 'MULTIPLE_CHOICE',
  SINGLE_CHOICE = 'SINGLE_CHOICE',
  TRUE_FALSE = 'TRUE_FALSE',
  MATCHING = 'MATCHING',
  SHORT_ANSWER = 'SHORT_ANSWER'
}

/**
 * Payment status types
 */
export enum PaymentStatus {
  PAID = 'PAID',
  PENDING = 'PENDING',
  FAILED = 'FAILED',
  NOT_PAID = 'NOT_PAID',
  NOT_REQUIRED = 'NOT_REQUIRED'
}

/**
 * Question status in an attempt
 */
export enum QuestionStatus {
  UNANSWERED = 'UNANSWERED',
  ANSWERED_CORRECT = 'CORRECT',
  ANSWERED_INCORRECT = 'INCORRECT',
  ANSWERED_PENDING = 'PENDING'
}
