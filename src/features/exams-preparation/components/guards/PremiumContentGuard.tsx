/**
 * Premium Content Guard Component
 * 
 * This component controls access to premium exam content based on payment status.
 * It redirects users to the payment page if they haven't purchased the content,
 * and allows access if they have.
 * 
 * Leverages both core auth and rbac modules for access control.
 */

import React, { ReactNode } from 'react';
import { useRouter } from 'next/router';
import { useExamPayments } from '../../api/hooks/useExamPayments';
import { usePermissions } from '@/core/rbac';
import { EXAM_PERMISSIONS } from '../../api/constants/permissions';
import { ErrorState, LoadingState } from '../atoms';

interface PremiumContentGuardProps {
  examId: number;
  children: ReactNode;
  fallback?: ReactNode;
}

/**
 * Guard component that checks if user has paid for premium content
 */
export const PremiumContentGuard: React.FC<PremiumContentGuardProps> = ({ 
  examId, 
  children,
  fallback
}) => {
  const router = useRouter();
  const { hasPermission } = usePermissions();
  const { 
    hasAccess, 
    isLoading, 
    error, 
    isPremiumContent 
  } = useExamPayments(examId);
  
  // If still loading payment info, show loading state
  if (isLoading) {
    return <LoadingState message="Checking access..." />;
  }
  
  // If there was an error checking payment status
  if (error) {
    return <ErrorState message={error} />;
  }
  
  // If content is not premium, allow access immediately
  if (!isPremiumContent) {
    return <>{children}</>;
  }
  
  // Check if user has admin override permission from core RBAC
  const hasAdminAccess = hasPermission(EXAM_PERMISSIONS.VIEW_PREMIUM);
  
  // If user has access (has paid or has admin override permission), allow access
  if (hasAccess || hasAdminAccess) {
    return <>{children}</>;
  }
  
  // If fallback is provided, render it instead of redirecting
  if (fallback) {
    return <>{fallback}</>;
  }
  
  // Otherwise, redirect to payment page
  router.push(`/exams-preparation/payment/${examId}`);
  return null;
};
