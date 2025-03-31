/**
 * Example: Conditional Button with RBAC
 * 
 * This example demonstrates how to conditionally render UI elements
 * (like buttons) based on user permissions using RBAC guards.
 */

import React from 'react';
import { Button } from '@/core/ui/atoms';
import { useExamPermission } from '../hooks/useExamPermission';
import { ExamOperation } from '../types';
import { LoadingSpinner } from '@/core/ui/feedback';

interface EditExamButtonProps {
  examId: number;
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'outlined';
}

/**
 * A button component that only appears for users who have
 * permission to edit exams. Integrates with RBAC.
 */
export const EditExamButton: React.FC<EditExamButtonProps> = ({ 
  examId, 
  onClick, 
  variant = 'primary' 
}) => {
  // Check if user has permission to edit exams
  const { hasPermission, isLoading } = useExamPermission(
    ExamOperation.EDIT_EXAM,
    { context: { examId } } // Provide context for permission check
  );
  
  // If still loading permissions, return a loading spinner
  if (isLoading) {
    return <LoadingSpinner size="small" />;
  }
  
  // If user doesn't have permission, return nothing
  if (!hasPermission) {
    return null;
  }
  
  // User has permission, render the button
  return (
    <Button 
      onClick={onClick} 
      variant={variant}
      data-testid="edit-exam-button"
    >
      Edit Exam
    </Button>
  );
};

/**
 * Example usage:
 * 
 * ```tsx
 * <EditExamButton 
 *   examId={123}
 *   onClick={() => router.push(`/exams/${examId}/edit`)}
 * />
 * ```
 * 
 * This button will only appear for users who have the EDIT_EXAM permission.
 * For other users, it will not render at all.
 */