/**
 * Exams Preparation RBAC (Role-Based Access Control)
 * 
 * This module handles role-based access control for the exams-preparation feature.
 * It defines permissions, operations, and access control logic specific to this feature.
 * 
 * Fully integrated with core RBAC module for consistent permission handling.
 * 
 * @module exams-preparation/rbac
 */

// Import core RBAC components
import { RBACProvider, PermissionGuard, RoleGuard } from '@/core/rbac/components';

// Import core RBAC hooks
import { usePermissions, useRoles } from '@/core/rbac/hooks';

// Export our new types, hooks, guards, and constants
export * from './types';
export * from './hooks';
export * from './guards';
export * from './server';
export * from './constants';

// Re-export the legacy ExamPermission enum for backward compatibility
export enum ExamPermission {
  VIEW_EXAMS = 'exam:view',
  TAKE_EXAM = 'exam:take',
  VIEW_RESULTS = 'exam:results:view',
  CREATE_EXAM = 'exam:create',
  EDIT_EXAM = 'exam:edit',
  DELETE_EXAM = 'exam:delete',
  MANAGE_PREMIUM = 'exam:premium:manage',
}

// Define exam-specific roles and their associated permissions (for backward compatibility)
export const ExamRole = {
  STUDENT: [
    ExamPermission.VIEW_EXAMS,
    ExamPermission.TAKE_EXAM,
    ExamPermission.VIEW_RESULTS,
  ],
  INSTRUCTOR: [
    ExamPermission.VIEW_EXAMS,
    ExamPermission.TAKE_EXAM,
    ExamPermission.VIEW_RESULTS,
    ExamPermission.CREATE_EXAM,
    ExamPermission.EDIT_EXAM,
  ],
  ADMIN: Object.values(ExamPermission),
};

// Re-export the RBAC provider and core guards
export { 
  RBACProvider as ExamRBACProvider,
  PermissionGuard,
  RoleGuard
};

/**
 * Legacy custom hook for exam-specific permissions
 * This is kept for backward compatibility
 * New code should use useExamPermission or useExamFeatureAccess
 */
export function useExamPermissions() {
  const { hasPermission, checkPermissions } = usePermissions();
  const { hasRole } = useRoles();
  
  return {
    // Basic permission checks
    hasPermission,
    checkPermissions,
    hasRole,
    
    // Exam-specific convenience methods
    canViewExam: () => hasPermission(ExamPermission.VIEW_EXAMS),
    canTakeExam: () => hasPermission(ExamPermission.TAKE_EXAM),
    canViewResults: () => hasPermission(ExamPermission.VIEW_RESULTS),
    canCreateExam: () => hasPermission(ExamPermission.CREATE_EXAM),
    canEditExam: () => hasPermission(ExamPermission.EDIT_EXAM),
    canDeleteExam: () => hasPermission(ExamPermission.DELETE_EXAM),
    canManagePremium: () => hasPermission(ExamPermission.MANAGE_PREMIUM),
    
    // Role-based convenience methods
    isAdmin: () => hasRole('admin'),
    isInstructor: () => hasRole('instructor'),
    isStudent: () => hasRole('student'),
  };
}

// Legacy individual exports for backward compatibility
export const canViewExam = () => {
  const { hasPermission } = usePermissions();
  return hasPermission(ExamPermission.VIEW_EXAMS);
};

export const canTakeExam = () => {
  const { hasPermission } = usePermissions();
  return hasPermission(ExamPermission.TAKE_EXAM);
};

export const canViewResults = () => {
  const { hasPermission } = usePermissions();
  return hasPermission(ExamPermission.VIEW_RESULTS);
};

export const canCreateExam = () => {
  const { hasPermission } = usePermissions();
  return hasPermission(ExamPermission.CREATE_EXAM);
};

export const canEditExam = () => {
  const { hasPermission } = usePermissions();
  return hasPermission(ExamPermission.EDIT_EXAM);
};

export const canDeleteExam = () => {
  const { hasPermission } = usePermissions();
  return hasPermission(ExamPermission.DELETE_EXAM);
};

export const canManagePremium = () => {
  const { hasPermission } = usePermissions();
  return hasPermission(ExamPermission.MANAGE_PREMIUM);
};
