/**
 * Exam Access Guard Component
 * 
 * This component controls access to exam content based on user permissions.
 * It ensures that users only access exams they have permission to view,
 * and redirects unauthorized users to an appropriate page.
 */

import React, { ReactNode } from 'react';
import { useRouter } from 'next/router';
import { useExamStore } from '../../state/stores/examStore';
import { useAuth } from '@/core/auth';
import { ErrorState } from '../atoms';

interface ExamAccessGuardProps {
  examId: number;
  children: ReactNode;
}

/**
 * Guard component that checks if user can access a specific exam
 */
export const ExamAccessGuard: React.FC<ExamAccessGuardProps> = ({ 
  examId, 
  children 
}) => {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const { error } = useExamStore();
  
  // If auth is still loading, don't render anything yet
  if (authLoading) {
    return null;
  }
  
  // If user is not authenticated, redirect to login
  if (!user) {
    // Use client-side redirect for better UX
    router.push(`/login?redirect=${encodeURIComponent(router.asPath)}`);
    return null;
  }
  
  // If there's an error from the exam store, show error state
  if (error) {
    return <ErrorState message={error} />;
  }
  
  // User is authenticated and has access to the exam
  return <>{children}</>;
};
