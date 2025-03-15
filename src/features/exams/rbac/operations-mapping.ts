/**
 * Mapping between old permission names and new operation names
 * This helps maintain consistency during migration
 */

import { ExamOperation } from '../hooks/useExamFeatureAccess';
import { ExamPermission } from '../constants/deprecated/permissions';

/**
 * Maps old permission names to new operation names
 */
export const permissionToOperationMap: Record<string, ExamOperation> = {
  // Basic access
  [ExamPermission.VIEW_EXAMS]: ExamOperation.VIEW,
  [ExamPermission.TAKE_EXAM]: ExamOperation.TAKE,
  
  // Management
  [ExamPermission.CREATE_EXAM]: ExamOperation.CREATE,
  [ExamPermission.EDIT_EXAM]: ExamOperation.EDIT,
  [ExamPermission.DELETE_EXAM]: ExamOperation.DELETE,
  [ExamPermission.DUPLICATE_EXAM]: ExamOperation.DUPLICATE,
  
  // Questions
  [ExamPermission.MANAGE_QUESTIONS]: ExamOperation.MANAGE_QUESTIONS,
  
  // Administration
  [ExamPermission.PUBLISH_EXAM]: ExamOperation.PUBLISH,
  [ExamPermission.UNPUBLISH_EXAM]: ExamOperation.UNPUBLISH,
  [ExamPermission.ASSIGN_EXAM]: ExamOperation.ASSIGN,
  
  // Results
  [ExamPermission.GRADE_EXAM]: ExamOperation.GRADE,
  [ExamPermission.VIEW_RESULTS]: ExamOperation.VIEW_RESULTS,
  [ExamPermission.EXPORT_RESULTS]: ExamOperation.EXPORT_RESULTS,
  
  // Analytics
  [ExamPermission.VIEW_ANALYTICS]: ExamOperation.VIEW_ANALYTICS,
};

/**
 * Maps known permission strings to operations
 * Useful for sidebar menu items and other components still using string-based permissions
 */
export const stringToOperationMap: Record<string, ExamOperation> = {
  'view_exams': ExamOperation.VIEW,
  'take_exam': ExamOperation.TAKE,
  'create_exam': ExamOperation.CREATE,
  'edit_exam': ExamOperation.EDIT,
  'delete_exam': ExamOperation.DELETE,
  'duplicate_exam': ExamOperation.DUPLICATE,
  'manage_questions': ExamOperation.MANAGE_QUESTIONS,
  'publish_exam': ExamOperation.PUBLISH,
  'unpublish_exam': ExamOperation.UNPUBLISH,
  'assign_exam': ExamOperation.ASSIGN,
  'grade_exam': ExamOperation.GRADE,
  'view_results': ExamOperation.VIEW_RESULTS,
  'export_results': ExamOperation.EXPORT_RESULTS,
  'view_analytics': ExamOperation.VIEW_ANALYTICS,
  
  // Special mapping for sidebar menu items
  'view_past_papers': ExamOperation.VIEW,
  'view_model_papers': ExamOperation.VIEW,
  'view_subject_papers': ExamOperation.VIEW,
  'view_practice_exams': ExamOperation.TAKE
};

/**
 * Converts a permission string to an operation
 * @param permission The permission string to convert
 * @returns The corresponding operation or undefined if not found
 */
export function permissionToOperation(permission: string): ExamOperation | undefined {
  return stringToOperationMap[permission] || 
         permissionToOperationMap[permission as ExamPermission];
}
