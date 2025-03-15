"use client"

import React from 'react';
import { Badge } from '@/components/ui/badge';
import { ArchiveIcon, CheckCircleIcon, CircleIcon } from 'lucide-react';

interface ExamStatusBadgeProps {
  status?: string;
}

/**
 * Component to display a status badge for exams
 */
export const ExamStatusBadge: React.FC<ExamStatusBadgeProps> = ({ status }) => {
  // Default to unknown if status is undefined or null
  if (!status) {
    return <Badge variant="outline" className="flex items-center gap-1">
      <CircleIcon className="h-3 w-3"/> Unknown
    </Badge>;
  }
  
  switch (status) {
    case 'PUBLISHED':
      return <Badge variant="success" className="flex items-center gap-1">
        <CheckCircleIcon className="h-3 w-3"/> Published
      </Badge>;
    case 'DRAFT':
      return <Badge variant="secondary" className="flex items-center gap-1">
        <CircleIcon className="h-3 w-3"/> Draft
      </Badge>;
    case 'ARCHIVED':
      return <Badge variant="outline" className="flex items-center gap-1">
        <ArchiveIcon className="h-3 w-3"/> Archived
      </Badge>;
    default:
      return <Badge>{status}</Badge>;
  }
};
