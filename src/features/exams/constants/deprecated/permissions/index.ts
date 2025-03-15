/**
 * DEPRECATED: Use ExamOperation from '@/features/exams/rbac' instead.
 * 
 * This enum will be removed in a future version. It is maintained for backward compatibility.
 * 
 * Migration guide:
 * 1. Replace import { ExamPermission } from '@/features/exams/constants/permissions'
 *    with import { ExamOperation } from '@/features/exams/rbac'
 * 
 * 2. Replace permission strings with operation strings:
 *    - ExamPermission.VIEW_EXAMS → ExamOperation.VIEW
 *    - ExamPermission.TAKE_EXAM → ExamOperation.TAKE
 *    - ExamPermission.CREATE_EXAM → ExamOperation.CREATE
 *    etc.
 */

/**
 * Exam-specific permissions
 */
export enum ExamPermission {
  // Basic exam access
  VIEW_EXAMS = 'exams:view',
  TAKE_EXAM = 'exams:take',
  
  // Exam creation & management
  CREATE_EXAM = 'exams:create',
  EDIT_EXAM = 'exams:edit',
  DELETE_EXAM = 'exams:delete',
  DUPLICATE_EXAM = 'exams:duplicate',
  
  // Question management
  MANAGE_QUESTIONS = 'exams:manage-questions',
  
  // Exam administration
  PUBLISH_EXAM = 'exams:publish',
  UNPUBLISH_EXAM = 'exams:unpublish',
  ASSIGN_EXAM = 'exams:assign',
  
  // Results & grading
  GRADE_EXAM = 'exams:grade',
  VIEW_RESULTS = 'exams:view-results',
  EXPORT_RESULTS = 'exams:export-results',
  
  // Analytics
  VIEW_ANALYTICS = 'exams:view-analytics'
}

/**
 * Admin-only permissions within this feature
 */
export const EXAMS_ADMIN_PERMISSIONS = [
  ExamPermission.CREATE_EXAM,
  ExamPermission.EDIT_EXAM,
  ExamPermission.DELETE_EXAM,
  ExamPermission.PUBLISH_EXAM,
  ExamPermission.UNPUBLISH_EXAM,
  ExamPermission.EXPORT_RESULTS
];

/**
 * Permissions that all roles have
 */
export const EXAMS_COMMON_PERMISSIONS = [
  ExamPermission.VIEW_EXAMS,
  ExamPermission.TAKE_EXAM,
  ExamPermission.VIEW_RESULTS
];
