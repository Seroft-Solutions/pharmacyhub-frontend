/**
 * ConditionalContent
 * 
 * A component that conditionally renders content based on exam permissions.
 * Designed for inline use within components for conditional UI elements.
 */
import React, { ReactNode } from 'react';
import { useExamPermission } from '../hooks';
import { ExamOperation, ExamPermissionOptions } from '../types';

interface ConditionalContentProps {
  /** The operation to check permission for */
  operation: ExamOperation;
  
  /** Content to render if the user has permission */
  children: ReactNode;
  
  /** Content to render if the user doesn't have permission (default: null) */
  fallback?: ReactNode;
  
  /** Additional options for the permission check */
  options?: ExamPermissionOptions;
  
  /** Whether to show content during loading (default: false) */
  showWhenLoading?: boolean;
}

/**
 * Component that conditionally renders content based on exam permissions
 * Unlike the ExamOperationGuard, this is designed for inline use within components
 * and doesn't provide elaborate fallbacks or loading states.
 * 
 * @example
 * // Basic usage
 * <ConditionalContent operation={ExamOperation.EDIT_EXAM}>
 *   <EditButton />
 * </ConditionalContent>
 * 
 * @example
 * // With fallback
 * <ConditionalContent 
 *   operation={ExamOperation.DELETE_EXAM}
 *   fallback={<DisabledButton />}
 * >
 *   <DeleteButton />
 * </ConditionalContent>
 * 
 * @example
 * // With context
 * <ConditionalContent 
 *   operation={ExamOperation.VIEW_RESULTS}
 *   options={{ context: { examId, userId } }}
 * >
 *   <ResultsPanel />
 * </ConditionalContent>
 */
export const ConditionalContent: React.FC<ConditionalContentProps> = ({
  operation,
  children,
  fallback = null,
  options,
  showWhenLoading = false,
}) => {
  const { hasPermission, isLoading } = useExamPermission(operation, options);

  if (isLoading) {
    return showWhenLoading ? <>{children}</> : null;
  }

  if (hasPermission) {
    return <>{children}</>;
  }

  return <>{fallback}</>;
};

export default ConditionalContent;
