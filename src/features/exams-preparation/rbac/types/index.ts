/**
 * Exam RBAC Types
 * 
 * This module defines the TypeScript types for exam-specific RBAC.
 * 
 * The RBAC system for exams-preparation is built on top of the core RBAC module
 * and provides a more domain-specific interface for working with exam permissions.
 * 
 * @module exams-preparation/rbac/types
 */

import { Permission, PermissionCheckOptions } from '@/core/rbac/types';
import { EXAM_PERMISSIONS, PAPER_PERMISSIONS, ATTEMPT_PERMISSIONS, QUESTION_PERMISSIONS } from '../../api/constants/permissions';

/**
 * Exam Operations Enum
 * 
 * Defines the granular operations that can be performed in the exams feature.
 * Used for permission checks and UI rendering decisions.
 * 
 * Each operation represents a specific action that a user can perform within the exams feature.
 * Operations are mapped to permissions through the OperationPermissionMap.
 */
export enum ExamOperation {
  // View operations
  VIEW_EXAMS = 'VIEW_EXAMS',                // Permission to view the list of exams
  VIEW_EXAM_DETAILS = 'VIEW_EXAM_DETAILS',  // Permission to view detailed exam information
  VIEW_RESULTS = 'VIEW_RESULTS',            // Permission to view one's own results
  VIEW_ALL_RESULTS = 'VIEW_ALL_RESULTS',    // Permission to view results of all users
  
  // Exam management operations
  CREATE_EXAM = 'CREATE_EXAM',              // Permission to create new exams
  EDIT_EXAM = 'EDIT_EXAM',                  // Permission to edit existing exams
  DELETE_EXAM = 'DELETE_EXAM',              // Permission to delete exams
  PUBLISH_EXAM = 'PUBLISH_EXAM',            // Permission to publish exams (make them visible)
  ARCHIVE_EXAM = 'ARCHIVE_EXAM',            // Permission to archive exams
  DUPLICATE_EXAM = 'DUPLICATE_EXAM',        // Permission to duplicate/clone an exam
  IMPORT_EXAM = 'IMPORT_EXAM',              // Permission to import exams from external sources
  EXPORT_EXAM = 'EXPORT_EXAM',              // Permission to export exams to external formats
  
  // Question management operations
  MANAGE_QUESTIONS = 'MANAGE_QUESTIONS',    // General permission to manage questions
  CREATE_QUESTION = 'CREATE_QUESTION',      // Permission to create new questions
  EDIT_QUESTION = 'EDIT_QUESTION',          // Permission to edit existing questions
  DELETE_QUESTION = 'DELETE_QUESTION',      // Permission to delete questions
  REORDER_QUESTIONS = 'REORDER_QUESTIONS',  // Permission to change question order
  
  // Student operations
  TAKE_EXAM = 'TAKE_EXAM',                  // Permission to attempt an exam
  SUBMIT_EXAM = 'SUBMIT_EXAM',              // Permission to submit exam answers
  RESUME_EXAM = 'RESUME_EXAM',              // Permission to resume an incomplete exam
  
  // Payment operations
  MANAGE_PAYMENTS = 'MANAGE_PAYMENTS',      // Permission to manage payment settings
  ACCESS_PREMIUM = 'ACCESS_PREMIUM',        // Permission to access premium exams
  PURCHASE_EXAM = 'PURCHASE_EXAM',          // Permission to purchase exams
  
  // Analytics operations
  VIEW_ANALYTICS = 'VIEW_ANALYTICS',        // Permission to view exam analytics
  EXPORT_ANALYTICS = 'EXPORT_ANALYTICS',    // Permission to export analytics data
}

/**
 * Maps ExamOperation to actual permissions
 * This allows us to use enum values for better type safety, while mapping to actual permission strings
 * 
 * When performing permission checks, the operation is converted to the corresponding
 * permission string(s) which are then checked against the user's permissions.
 * 
 * Some operations may require multiple permissions, in which case the user must have all
 * of the specified permissions to perform the operation.
 */
export const OperationPermissionMap: Record<ExamOperation, Permission | Permission[]> = {
  // View operations
  [ExamOperation.VIEW_EXAMS]: EXAM_PERMISSIONS.VIEW,
  [ExamOperation.VIEW_EXAM_DETAILS]: EXAM_PERMISSIONS.VIEW_DETAILS,
  [ExamOperation.VIEW_RESULTS]: EXAM_PERMISSIONS.VIEW_RESULTS,
  [ExamOperation.VIEW_ALL_RESULTS]: [EXAM_PERMISSIONS.VIEW_RESULTS, 'admin:view'],
  
  // Exam management operations
  [ExamOperation.CREATE_EXAM]: EXAM_PERMISSIONS.CREATE,
  [ExamOperation.EDIT_EXAM]: EXAM_PERMISSIONS.EDIT,
  [ExamOperation.DELETE_EXAM]: EXAM_PERMISSIONS.DELETE,
  [ExamOperation.PUBLISH_EXAM]: EXAM_PERMISSIONS.PUBLISH,
  [ExamOperation.ARCHIVE_EXAM]: EXAM_PERMISSIONS.ARCHIVE,
  [ExamOperation.DUPLICATE_EXAM]: [EXAM_PERMISSIONS.VIEW, EXAM_PERMISSIONS.CREATE],
  [ExamOperation.IMPORT_EXAM]: [EXAM_PERMISSIONS.CREATE, 'import:exams'],
  [ExamOperation.EXPORT_EXAM]: [EXAM_PERMISSIONS.VIEW, 'export:exams'],
  
  // Question management operations
  [ExamOperation.MANAGE_QUESTIONS]: EXAM_PERMISSIONS.EDIT_QUESTIONS,
  [ExamOperation.CREATE_QUESTION]: QUESTION_PERMISSIONS.CREATE,
  [ExamOperation.EDIT_QUESTION]: QUESTION_PERMISSIONS.EDIT,
  [ExamOperation.DELETE_QUESTION]: QUESTION_PERMISSIONS.DELETE,
  [ExamOperation.REORDER_QUESTIONS]: [QUESTION_PERMISSIONS.EDIT, EXAM_PERMISSIONS.EDIT],
  
  // Student operations
  [ExamOperation.TAKE_EXAM]: EXAM_PERMISSIONS.TAKE_EXAM,
  [ExamOperation.SUBMIT_EXAM]: ATTEMPT_PERMISSIONS.SUBMIT,
  [ExamOperation.RESUME_EXAM]: [EXAM_PERMISSIONS.TAKE_EXAM, ATTEMPT_PERMISSIONS.RESUME],
  
  // Payment operations
  [ExamOperation.MANAGE_PAYMENTS]: 'payments:manage',
  [ExamOperation.ACCESS_PREMIUM]: 'premium:access',
  [ExamOperation.PURCHASE_EXAM]: 'exam:purchase',
  
  // Analytics operations
  [ExamOperation.VIEW_ANALYTICS]: 'analytics:view',
  [ExamOperation.EXPORT_ANALYTICS]: ['analytics:view', 'analytics:export'],
};

/**
 * Operation Context for permission checks
 * Provides additional context for permission checks
 * 
 * This context can be passed to permission check functions to provide
 * additional data that might influence the permission decision.
 * 
 * For example, a user might have permission to edit their own exams,
 * but not exams created by others. The examId and userId can be used
 * to determine ownership for such checks.
 */
export interface ExamOperationContext {
  examId?: number;
  userId?: string;
  questionId?: number;
  attemptId?: string;
  organizationId?: string;
}

/**
 * ExamPermissionOptions extends core PermissionCheckOptions
 */
export interface ExamPermissionOptions extends PermissionCheckOptions {
  context?: ExamOperationContext;
}
