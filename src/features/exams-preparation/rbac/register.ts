/**
 * RBAC Registration Module
 * 
 * This module registers the exams-preparation feature's permissions and roles with the
 * core RBAC registry. This allows the core RBAC module to know about and manage
 * exams-specific permissions.
 * 
 * Should be called during application initialization.
 */

import { registerFeature } from '@/core/rbac/registry';
import { ExamPermission, ExamRole } from './index';
import { EXAM_PERMISSIONS, PAPER_PERMISSIONS, ATTEMPT_PERMISSIONS, QUESTION_PERMISSIONS } from '../api/constants/permissions';

/**
 * Register Exams permissions with core RBAC registry
 * 
 * Should be called during application initialization to ensure all exams-related
 * permissions are properly registered with the RBAC system.
 */
export function registerExamsRBAC() {
  // Register feature with legacy permission structure
  registerFeature({
    name: 'exams',
    permissions: Object.values(ExamPermission),
    roles: {
      admin: ExamRole.ADMIN,
      instructor: ExamRole.INSTRUCTOR,
      student: ExamRole.STUDENT,
    },
    defaultEnabled: true,
  });
  
  // Register feature with updated permission structure
  registerFeature({
    name: 'exams-preparation',
    permissions: [
      ...Object.values(EXAM_PERMISSIONS),
      ...Object.values(PAPER_PERMISSIONS),
      ...Object.values(ATTEMPT_PERMISSIONS),
      ...Object.values(QUESTION_PERMISSIONS),
    ],
    roles: {
      admin: [
        ...Object.values(EXAM_PERMISSIONS),
        ...Object.values(PAPER_PERMISSIONS),
        ...Object.values(ATTEMPT_PERMISSIONS),
        ...Object.values(QUESTION_PERMISSIONS),
      ],
      instructor: [
        EXAM_PERMISSIONS.VIEW,
        EXAM_PERMISSIONS.VIEW_DETAILS,
        EXAM_PERMISSIONS.VIEW_RESULTS,
        EXAM_PERMISSIONS.CREATE,
        EXAM_PERMISSIONS.EDIT,
        EXAM_PERMISSIONS.PUBLISH,
        PAPER_PERMISSIONS.VIEW_ALL,
        PAPER_PERMISSIONS.CREATE,
        PAPER_PERMISSIONS.EDIT,
        QUESTION_PERMISSIONS.VIEW,
        QUESTION_PERMISSIONS.CREATE,
        QUESTION_PERMISSIONS.EDIT,
      ],
      student: [
        EXAM_PERMISSIONS.VIEW,
        EXAM_PERMISSIONS.VIEW_DETAILS,
        EXAM_PERMISSIONS.TAKE_EXAM,
        PAPER_PERMISSIONS.VIEW_ALL,
        PAPER_PERMISSIONS.VIEW_MODEL,
        PAPER_PERMISSIONS.VIEW_PAST,
        ATTEMPT_PERMISSIONS.VIEW_OWN,
        ATTEMPT_PERMISSIONS.START,
        ATTEMPT_PERMISSIONS.SUBMIT,
        ATTEMPT_PERMISSIONS.ANSWER,
      ],
    },
    defaultEnabled: true,
  });
}

/**
 * Export a function to initialize the exams RBAC module
 * 
 * This can be called from app initialization code:
 * 
 * @example
 * // In app initialization
 * import { initializeExamsRBAC } from '@/features/exams-preparation/rbac/register';
 * 
 * initializeExamsRBAC();
 */
export function initializeExamsRBAC() {
  registerExamsRBAC();
}

export default registerExamsRBAC;
