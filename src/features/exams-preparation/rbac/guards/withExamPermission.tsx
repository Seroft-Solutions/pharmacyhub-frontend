/**
 * withExamPermission
 * 
 * A higher-order component that protects pages based on exam permissions.
 * Routes wrapped with this HOC will automatically check permissions and
 * show an access denied page or redirect if the user doesn't have permission.
 */
'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useExamPermission } from '../hooks';
import { ExamOperation, ExamPermissionOptions } from '../types';
import { AccessDeniedPage } from './AccessDeniedPage';

interface WithExamPermissionOptions extends ExamPermissionOptions {
  fallbackUrl?: string;
  customFallback?: React.ReactNode;
}

/**
 * Higher-order component to protect pages based on exam permissions
 * 
 * @param Component The component to render if permission check passes
 * @param operation The operation to check permission for
 * @param options Additional options for permission check
 * 
 * @example
 * // Basic usage
 * const ProtectedPage = withExamPermission(
 *   DashboardComponent, 
 *   ExamOperation.VIEW_EXAMS
 * );
 * 
 * @example
 * // With context and redirect
 * const ProtectedEditPage = withExamPermission(
 *   EditExamComponent,
 *   ExamOperation.EDIT_EXAM,
 *   {
 *     context: { examId },
 *     fallbackUrl: '/exams'
 *   }
 * );
 */
export function withExamPermission<P extends object>(
  Component: React.ComponentType<P>,
  operation: ExamOperation,
  options: WithExamPermissionOptions = {}
) {
  const { fallbackUrl, customFallback, ...permissionOptions } = options;

  return function ProtectedPage(props: P) {
    const router = useRouter();
    const { hasPermission, isLoading, error } = useExamPermission(operation, permissionOptions);

    useEffect(() => {
      // If we have a fallback URL and the user doesn't have permission, redirect
      if (!isLoading && !hasPermission && fallbackUrl) {
        router.push(fallbackUrl);
      }
    }, [fallbackUrl, hasPermission, isLoading, router]);

    // Handle loading state
    if (isLoading) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded-full animate-pulse bg-blue-600"></div>
            <div className="w-4 h-4 rounded-full animate-pulse bg-blue-600"></div>
            <div className="w-4 h-4 rounded-full animate-pulse bg-blue-600"></div>
          </div>
          <p className="ml-2">Checking permissions...</p>
        </div>
      );
    }

    // Handle permission denied
    if (!hasPermission) {
      // If a custom fallback is provided, render it
      if (customFallback) {
        return <>{customFallback}</>;
      }

      // If no fallback URL is provided, render the access denied page
      if (!fallbackUrl) {
        return <AccessDeniedPage operation={operation} />;
      }

      // If we're redirecting, render nothing
      return null;
    }

    // Render the protected component if the user has permission
    return <Component {...props} />;
  };
}

export default withExamPermission;
