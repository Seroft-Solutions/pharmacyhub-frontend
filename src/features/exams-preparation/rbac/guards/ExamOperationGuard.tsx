/**
 * ExamOperationGuard Component
 * 
 * A component that conditionally renders content based on exam-specific operation permission checks.
 * This is a wrapper around the core PermissionGuard that provides a more convenient API for exams.
 * 
 * This guard component implements best practices for handling loading states, error states,
 * and provides meaningful feedback when access is denied.
 */
import React, { ReactNode } from 'react';
import { useExamPermission } from '../hooks/useExamPermission';
import { ExamOperation, ExamPermissionOptions } from '../types';
import { AccessDenied } from '@/core/rbac/components';
import { OPERATION_DESCRIPTIONS } from '../constants';

/**
 * Props for the ExamOperationGuard component
 */
interface ExamOperationGuardProps {
  /**
   * The operation to check permission for
   */
  operation: ExamOperation;
  
  /**
   * Additional context data for the permission check
   */
  options?: ExamPermissionOptions;
  
  /**
   * Content to render when permission check passes
   */
  children: ReactNode;
  
  /**
   * Content to render when permission check fails (optional)
   */
  fallback?: ReactNode;
  
  /**
   * Whether to render nothing when permission check fails
   * @default false
   */
  renderNothing?: boolean;
  
  /**
   * Component to display while permissions are being checked
   */
  loadingComponent?: ReactNode;
  
  /**
   * Custom error message to display when permission check fails
   */
  errorMessage?: string;
  
  /**
   * Component to display when there's an error checking permissions
   */
  errorComponent?: ReactNode;
}

/**
 * Default loading component
 */
const DefaultLoadingComponent = () => (
  <div className="flex items-center justify-center p-4 text-gray-500">
    <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
      <circle 
        className="opacity-25" 
        cx="12" 
        cy="12" 
        r="10" 
        stroke="currentColor" 
        strokeWidth="4" 
        fill="none"
      />
      <path 
        className="opacity-75" 
        fill="currentColor" 
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" 
      />
    </svg>
    Checking permissions...
  </div>
);

/**
 * Default error component
 */
const DefaultErrorComponent = ({ error }: { error: Error | null }) => (
  <div className="p-4 bg-red-50 border border-red-200 rounded-md text-red-800">
    <h3 className="font-semibold text-lg mb-2">Permission Check Error</h3>
    <p>{error?.message || 'An error occurred while checking permissions'}</p>
  </div>
);

/**
 * Component that conditionally renders content based on exam operation permission checks
 * 
 * @example
 * // Basic usage
 * <ExamOperationGuard operation={ExamOperation.VIEW_EXAMS}>
 *   <ExamList />
 * </ExamOperationGuard>
 * 
 * @example
 * // With custom fallback
 * <ExamOperationGuard 
 *   operation={ExamOperation.EDIT_EXAM} 
 *   options={{ context: { examId: exam.id } }}
 *   fallback={<p>You cannot edit this exam</p>}
 * >
 *   <EditExamForm exam={exam} />
 * </ExamOperationGuard>
 * 
 * @example
 * // With custom loading component
 * <ExamOperationGuard 
 *   operation={ExamOperation.VIEW_ANALYTICS} 
 *   loadingComponent={<AnalyticsLoader />}
 * >
 *   <AnalyticsDashboard />
 * </ExamOperationGuard>
 */
export const ExamOperationGuard: React.FC<ExamOperationGuardProps> = ({
  operation,
  options,
  children,
  fallback,
  renderNothing = false,
  loadingComponent,
  errorMessage,
  errorComponent,
}) => {
  // Use our enhanced exam permission hook
  const { hasPermission, isLoading, error, permissions } = useExamPermission(operation, options);
  
  // Handle loading state
  if (isLoading) {
    return loadingComponent || <DefaultLoadingComponent />;
  }
  
  // Handle error state
  if (error) {
    return errorComponent || <DefaultErrorComponent error={error} />;
  }
  
  // Handle permission denied
  if (!hasPermission) {
    if (renderNothing) {
      return null;
    }
    
    // Get a human-readable description of the operation
    const operationDescription = OPERATION_DESCRIPTIONS[operation] || operation.toString();
    
    // Build default fallback if none provided
    const defaultFallback = (
      <AccessDenied 
        operation={operation.toString()}
        message={errorMessage || `You don't have permission to ${operationDescription}`}
      />
    );
    
    return fallback || defaultFallback;
  }
  
  // Render children if permission check passes
  return <>{children}</>;
};

export default ExamOperationGuard;
