/**
 * Premium Content Guard Component
 * 
 * This component controls access to premium exam content based on payment status.
 * It redirects users to the payment page if they haven't purchased the content,
 * and allows access if they have.
 */

import React, { ReactNode } from 'react';
import { useRouter } from 'next/router';
import { useExamPayments } from '../../api/hooks/useExamPayments';
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
  
  // If user has access (has paid or has universal access), allow access
  if (hasAccess) {
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
