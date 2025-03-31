/**
 * ExamActionButtons
 * 
 * A reusable component that renders permission-checked action buttons for exams.
 * Only shows buttons that the user has permission to use.
 */
"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { Edit, Eye, Trash2 } from 'lucide-react';
import { useExamPermission, useGuardedCallback, ExamOperation } from '@/features/exams-preparation/rbac';

interface ExamActionButtonsProps {
  examId: string;
  onView?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  size?: 'default' | 'sm' | 'lg' | 'icon';
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  className?: string;
}

export const ExamActionButtons: React.FC<ExamActionButtonsProps> = ({ 
  examId, 
  onView, 
  onEdit, 
  onDelete,
  size = 'icon',
  variant = 'ghost',
  className = '' 
}) => {
  // Check permissions with context
  const { hasPermission: canViewDetails, isLoading: isLoadingView } = 
    useExamPermission(ExamOperation.VIEW_EXAM_DETAILS, { context: { examId } });
  
  const { hasPermission: canEdit, isLoading: isLoadingEdit } = 
    useExamPermission(ExamOperation.EDIT_EXAM, { context: { examId } });
  
  const { hasPermission: canDelete, isLoading: isLoadingDelete } = 
    useExamPermission(ExamOperation.DELETE_EXAM, { context: { examId } });

  // Create guarded callbacks
  const handleView = useGuardedCallback(
    ExamOperation.VIEW_EXAM_DETAILS,
    onView || (() => {}),
    { context: { examId }, showNotification: true }
  );

  const handleEdit = useGuardedCallback(
    ExamOperation.EDIT_EXAM,
    onEdit || (() => {}),
    { context: { examId }, showNotification: true }
  );

  const handleDelete = useGuardedCallback(
    ExamOperation.DELETE_EXAM,
    onDelete || (() => {}),
    { context: { examId }, showNotification: true }
  );

  // Loading state
  const isLoading = isLoadingView || isLoadingEdit || isLoadingDelete;
  if (isLoading) {
    return (
      <div className={`flex justify-end gap-2 ${className}`}>
        {onView && <Button variant={variant} size={size} disabled>
          <Eye className="h-4 w-4" />
        </Button>}
        {onEdit && <Button variant={variant} size={size} disabled>
          <Edit className="h-4 w-4" />
        </Button>}
        {onDelete && <Button variant={variant} size={size} disabled>
          <Trash2 className="h-4 w-4" />
        </Button>}
      </div>
    );
  }

  return (
    <div className={`flex justify-end gap-2 ${className}`}>
      {onView && canViewDetails && (
        <Button
          variant={variant}
          size={size}
          onClick={handleView}
          title="View"
        >
          <Eye className="h-4 w-4" />
        </Button>
      )}
      {onEdit && canEdit && (
        <Button
          variant={variant}
          size={size}
          onClick={handleEdit}
          title="Edit"
        >
          <Edit className="h-4 w-4" />
        </Button>
      )}
      {onDelete && canDelete && (
        <Button
          variant={variant}
          size={size}
          onClick={handleDelete}
          title="Delete"
          className="text-red-500 hover:text-red-600"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};

export default ExamActionButtons;
