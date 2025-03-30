/**
 * Exams Preparation RBAC (Role-Based Access Control)
 * 
 * This module handles role-based access control for the exams-preparation feature.
 * It defines permissions, operations, and access control logic specific to this feature.
 */

// Import core RBAC utilities
import { hasPermission, RBACProvider } from '@/core/rbac';

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

// Permission check utility for exams
export const hasExamPermission = (permission: ExamPermission) => {
  return hasPermission(permission);
};

// Re-export the RBAC provider
export { RBACProvider as ExamRBACProvider };

// Exam access policies
export const canViewExam = () => hasExamPermission(ExamPermission.VIEW_EXAMS);
export const canTakeExam = () => hasExamPermission(ExamPermission.TAKE_EXAM);
export const canViewResults = () => hasExamPermission(ExamPermission.VIEW_RESULTS);
export const canCreateExam = () => hasExamPermission(ExamPermission.CREATE_EXAM);
export const canEditExam = () => hasExamPermission(ExamPermission.EDIT_EXAM);
export const canDeleteExam = () => hasExamPermission(ExamPermission.DELETE_EXAM);
export const canManagePremium = () => hasExamPermission(ExamPermission.MANAGE_PREMIUM);
