/**
 * Exams Preparation RBAC (Role-Based Access Control)
 * 
 * This module handles role-based access control for the exams-preparation feature.
 * It defines permissions, operations, and access control logic specific to this feature.
 * 
 * Fully integrated with core RBAC module for consistent permission handling.
 */

// Import core RBAC utilities
import { RBACProvider } from '@/core/rbac';
import { usePermissions, useRoles } from '@/core/rbac/hooks';

// Define exam-specific permissions
export enum ExamPermission {
  VIEW_EXAMS = 'exam:view',
  TAKE_EXAM = 'exam:take',
  VIEW_RESULTS = 'exam:results:view',
  CREATE_EXAM = 'exam:create',
  EDIT_EXAM = 'exam:edit',
  DELETE_EXAM = 'exam:delete',
  MANAGE_PREMIUM = 'exam:premium:manage',
}

// Define exam-specific roles and their associated permissions
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

// Re-export the RBAC provider
export { RBACProvider as ExamRBACProvider };

/**
 * Custom hook for exam-specific permissions
 * This leverages the core RBAC hooks for consistent permission checking
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
