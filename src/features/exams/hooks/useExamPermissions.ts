/**
 * Hook for checking exam-specific permissions
 * 
 * This is a wrapper around the RBAC usePermissions hook that makes it easier
 * to check exam-specific permissions.
 */
import { usePermissions } from '@/features/core/rbac/hooks';
import { ExamPermission } from '../constants/permissions';

export function useExamPermissions() {
  const { 
    hasPermission, 
    hasAllPermissions, 
    hasAnyPermission,
    hasRole,
    hasAllRoles,
    hasAnyRole,
    hasAccess 
  } = usePermissions();

  // Check if the user can view exams
  const canViewExams = hasPermission(ExamPermission.VIEW_EXAMS);
  
  // Check if the user can take exams
  const canTakeExams = hasPermission(ExamPermission.TAKE_EXAM);
  
  // Check if the user can manage exams (create, edit, delete)
  const canManageExams = hasAnyPermission([
    ExamPermission.CREATE_EXAM,
    ExamPermission.EDIT_EXAM,
    ExamPermission.DELETE_EXAM
  ]);
  
  // Check if the user can administer exams (publish, unpublish, assign)
  const canAdministerExams = hasAnyPermission([
    ExamPermission.PUBLISH_EXAM,
    ExamPermission.UNPUBLISH_EXAM,
    ExamPermission.ASSIGN_EXAM
  ]);
  
  // Check if the user can manage results (grade, view results, export results)
  const canManageResults = hasAnyPermission([
    ExamPermission.GRADE_EXAM,
    ExamPermission.VIEW_RESULTS,
    ExamPermission.EXPORT_RESULTS
  ]);
  
  // Check if the user can access analytics
  const canAccessAnalytics = hasPermission(ExamPermission.VIEW_ANALYTICS);
  
  // Check if the user is an exams admin (has most admin permissions)
  const isExamsAdmin = hasAllPermissions([
    ExamPermission.CREATE_EXAM,
    ExamPermission.EDIT_EXAM,
    ExamPermission.PUBLISH_EXAM,
    ExamPermission.UNPUBLISH_EXAM
  ]);

  return {
    // Specific permission checks
    canViewExams,
    canTakeExams,
    canManageExams,
    canAdministerExams,
    canManageResults,
    canAccessAnalytics,
    isExamsAdmin,
    
    // Original permission check methods for more specific checks
    hasPermission,
    hasAllPermissions,
    hasAnyPermission,
    hasRole,
    hasAllRoles,
    hasAnyRole,
    hasAccess
  };
}
