/**
 * DEPRECATED: Use useExamFeatureAccess from '@/features/exams/rbac' instead.
 * 
 * This hook will be removed in a future version. It is maintained for backward compatibility.
 * 
 * Migration guide:
 * 1. Replace import { useExamPermissions } from '@/features/exams/hooks' 
 *    with import { useExamFeatureAccess } from '@/features/exams/rbac'
 * 
 * 2. Replace permission-based checks with operation-based checks:
 *    - canViewExams → canViewExams
 *    - canTakeExams → canTakeExams
 *    - canManageExams → canManageExams
 *    - hasPermission(ExamPermission.X) → checkExamOperation(ExamOperation.X)
 */

import { usePermissions } from '@/features/rbac/hooks';
import { ExamPermission } from '../../constants/deprecated/permissions';
import { useExamFeatureAccess } from '../../rbac';

export function useExamPermissions() {
  console.warn(
    '[DEPRECATED] useExamPermissions is deprecated. ' +
    'Use useExamFeatureAccess from @/features/exams/rbac instead.'
  );

  // Use the new hook internally to ensure consistency
  const {
    canViewExams,
    canTakeExams,
    canCreateExams,
    canEditExams,
    canDeleteExams,
    canManageExams,
    canAdministerExams,
    canManageResults,
    canViewAnalytics,
    isExamsAdmin,
    checkExamOperation
  } = useExamFeatureAccess();
  
  // Keep the original interface to ensure backward compatibility
  const { 
    hasPermission, 
    hasAllPermissions, 
    hasAnyPermission,
    hasRole,
    hasAllRoles,
    hasAnyRole,
    hasAccess 
  } = usePermissions();

  return {
    // Specific permission checks mapped to the new system
    canViewExams,
    canTakeExams,
    canManageExams,
    canAdministerExams,
    canManageResults: canManageResults,
    canAccessAnalytics: canViewAnalytics,
    isExamsAdmin,
    
    // Original permission check methods
    hasPermission,
    hasAllPermissions,
    hasAnyPermission,
    hasRole,
    hasAllRoles,
    hasAnyRole,
    hasAccess
  };
}
