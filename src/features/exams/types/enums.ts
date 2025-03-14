/**
 * Exam Types Enums
 * 
 * This file contains all enum definitions for the exams feature
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
