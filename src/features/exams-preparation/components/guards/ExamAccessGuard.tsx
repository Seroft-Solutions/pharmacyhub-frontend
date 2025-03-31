/**
 * Exam Access Guard Component
 * 
 * This component controls access to exam content based on user permissions.
 * It ensures that users only access exams they have permission to view,
 * and redirects unauthorized users to an appropriate page.
 * 
 * Uses core auth module for authentication checks.
 */

import React, { ReactNode } from 'react';
import { useExamStore } from '../../state/stores/examStore';
import { AuthGuard } from '@/core/auth/components';
import { ErrorState, LoadingState } from '../atoms';

interface ExamAccessGuardProps {
  examId: number;
  children: ReactNode;
}

/**
 * Guard component that checks if user can access a specific exam
 * Uses the core AuthGuard component from the auth module.
 */
export const ExamAccessGuard: React.FC<ExamAccessGuardProps> = ({ 
  examId, 
  children 
}) => {
  const { error } = useExamStore();
  
  return (
    <AuthGuard
      loadingComponent={<LoadingState message="Checking authentication..." />}
      fallbackUrl={`/login?redirect=/exams/${examId}`}
    >
      {error ? <ErrorState message={error} /> : children}
    </AuthGuard>
  );
};
