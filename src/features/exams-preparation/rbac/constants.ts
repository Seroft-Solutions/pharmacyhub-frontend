/**
 * RBAC Constants
 * 
 * This file contains constants used throughout the RBAC module.
 */

import { ExamOperation } from './types';

/**
 * Human-readable operation descriptions for better error messages
 */
export const OPERATION_DESCRIPTIONS: Record<ExamOperation, string> = {
  [ExamOperation.VIEW_EXAMS]: 'view the list of exams',
  [ExamOperation.VIEW_EXAM_DETAILS]: 'view detailed exam information',
  [ExamOperation.VIEW_RESULTS]: 'view your exam results',
  [ExamOperation.VIEW_ALL_RESULTS]: 'view all users\'s exam results',
  [ExamOperation.CREATE_EXAM]: 'create new exams',
  [ExamOperation.EDIT_EXAM]: 'edit existing exams',
  [ExamOperation.DELETE_EXAM]: 'delete exams',
  [ExamOperation.PUBLISH_EXAM]: 'publish exams',
  [ExamOperation.ARCHIVE_EXAM]: 'archive exams',
  [ExamOperation.DUPLICATE_EXAM]: 'duplicate/clone exams',
  [ExamOperation.IMPORT_EXAM]: 'import exams from external sources',
  [ExamOperation.EXPORT_EXAM]: 'export exams to external formats',
  [ExamOperation.MANAGE_QUESTIONS]: 'manage exam questions',
  [ExamOperation.CREATE_QUESTION]: 'create new questions',
  [ExamOperation.EDIT_QUESTION]: 'edit existing questions',
  [ExamOperation.DELETE_QUESTION]: 'delete questions',
  [ExamOperation.REORDER_QUESTIONS]: 'reorder questions',
  [ExamOperation.TAKE_EXAM]: 'take exams',
  [ExamOperation.SUBMIT_EXAM]: 'submit exam answers',
  [ExamOperation.RESUME_EXAM]: 'resume incomplete exams',
  [ExamOperation.MANAGE_PAYMENTS]: 'manage payment settings',
  [ExamOperation.ACCESS_PREMIUM]: 'access premium exams',
  [ExamOperation.PURCHASE_EXAM]: 'purchase exams',
  [ExamOperation.VIEW_ANALYTICS]: 'view exam analytics',
  [ExamOperation.EXPORT_ANALYTICS]: 'export analytics data'
};
