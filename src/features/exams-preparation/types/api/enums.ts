/**
 * Enums for Exams Preparation
 * 
 * This module defines all enum types used in the exams-preparation feature.
 */

/**
 * Status of an exam
 */
export enum ExamStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  ARCHIVED = 'ARCHIVED',
  DELETED = 'DELETED'
}

/**
 * Type of question
 */
export enum QuestionType {
  MULTIPLE_CHOICE = 'MULTIPLE_CHOICE',
  TRUE_FALSE = 'TRUE_FALSE',
  SINGLE_CHOICE = 'SINGLE_CHOICE'
}

/**
 * Difficulty level of a question
 */
export enum DifficultyLevel {
  EASY = 'EASY',
  MEDIUM = 'MEDIUM',
  HARD = 'HARD',
  EXPERT = 'EXPERT'
}

/**
 * Type of paper
 */
export enum PaperType {
  MODEL = 'MODEL',
  PAST = 'PAST',
  SUBJECT = 'SUBJECT',
  PRACTICE = 'PRACTICE'
}

/**
 * Status of an attempt
 */
export enum AttemptStatus {
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  TIMED_OUT = 'TIMED_OUT',
  ABANDONED = 'ABANDONED'
}

/**
 * Payment status
 */
export enum PaymentStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED'
}
