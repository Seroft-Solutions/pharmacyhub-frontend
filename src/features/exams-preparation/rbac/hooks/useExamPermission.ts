/**
 * useExamPermission Hook
 * 
 * A custom hook for checking exam-specific permissions based on operations.
 * This hook builds on the core RBAC hooks and provides a more convenient API
 * for exam-specific permission checks.
 * 
 * The hook is fully reactive - it will update when the user's permissions change.
 */

import { useMemo } from 'react';
import { usePermissions } from '@/core/rbac/hooks';
import { ExamOperation, OperationPermissionMap, ExamPermissionOptions } from '../types';

/**
 * Result interface for useExamPermission hook
 */
export interface ExamPermissionResult {
  /** Whether the user has permission for the requested operation */
  hasPermission: boolean;
  /** Whether the permission check is still loading */
  isLoading: boolean;
  /** Any error that occurred during the permission check */
  error: Error | null;
  /** The operation that was checked */
  operation: ExamOperation;
  /** The underlying permissions that were checked */
  permissions: string | string[];
}

/**
 * Custom hook for checking exam operation permissions
 * 
 * @param operation The exam operation to check permission for
 * @param options Permission check options including context data
 * @returns Object with permission check results
 * 
 * @example
 * // Check if user can view exams
 * const { hasPermission, isLoading } = useExamPermission(ExamOperation.VIEW_EXAMS);
 * 
 * @example
 * // Check if user can edit a specific exam
 * const { hasPermission } = useExamPermission(
 *   ExamOperation.EDIT_EXAM, 
 *   { context: { examId: 123 } }
 * );
 */
export function useExamPermission(
  operation: ExamOperation,
  options?: ExamPermissionOptions
): ExamPermissionResult {
  // Get the permission(s) for this operation
  const permissions = OperationPermissionMap[operation];
  
  // Use the core permissions hook
  const { 
    checkPermissions, 
    hasPermission: coreHasPermission, 
    isLoading, 
    error 
  } = usePermissions();
  
  // Memoize the permission check to prevent unnecessary re-renders
  const hasPermission = useMemo(() => {
    // If permissions is an array, we need to check if the user has all permissions
    if (Array.isArray(permissions)) {
      // Use checkPermissions which can check multiple permissions at once
      return checkPermissions(permissions, options?.context);
    } else {
      // Single permission check
      return coreHasPermission(permissions, options?.context);
    }
  }, [permissions, coreHasPermission, checkPermissions, options?.context]);
  
  // Return a well-typed result object
  return {
    hasPermission,
    isLoading,
    error,
    operation,
    permissions,
  };
}

export default useExamPermission;
