// ExamStatusBadge.tsx
"use client";

import React from 'react';
import { Badge, BadgeProps } from "@/features/core/ui/atoms/badge";

export type ExamStatus = 'draft' | 'published' | 'archived' | 'completed' | 'in-progress';

interface ExamStatusBadgeProps {
  status: ExamStatus;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const ExamStatusBadge: React.FC<ExamStatusBadgeProps> = ({ status, size = 'md', className = '' }) => {
  const getVariant = (status: ExamStatus): BadgeProps['variant'] => {
    switch (status) {
      case 'draft':
        return 'secondary';
      case 'published':
        return 'success';
      case 'archived':
        return 'destructive';
      case 'completed':
        return 'success';
      case 'in-progress':
        return 'warning';
      default:
        return 'default';
    }
  };

  const getLabel = (status: ExamStatus): string => {
    switch (status) {
      case 'draft':
        return 'Draft';
      case 'published':
        return 'Published';
      case 'archived':
        return 'Archived';
      case 'completed':
        return 'Completed';
      case 'in-progress':
        return 'In Progress';
      default:
        return status;
    }
  };

  return (
    <Badge 
      variant={getVariant(status)} 
      className={`${size === 'sm' ? 'text-xs py-0 px-2' : size === 'lg' ? 'text-sm py-1 px-3' : ''} ${className}`}
    >
      {getLabel(status)}
    </Badge>
  );
};

export default ExamStatusBadge;
