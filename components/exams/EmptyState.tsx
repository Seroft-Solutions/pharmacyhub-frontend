"use client"

import React from 'react';
import { FileTextIcon } from 'lucide-react';

interface EmptyStateProps {
  message?: string;
}

/**
 * Component for displaying empty state
 */
export const EmptyState: React.FC<EmptyStateProps> = ({ 
  message = 'Get started by creating your first exam using the upload form.'
}) => {
  return (
    <div className="text-center py-8">
      <FileTextIcon className="mx-auto h-12 w-12 text-muted-foreground opacity-50 mb-4"/>
      <h3 className="text-lg font-medium mb-2">No exams found</h3>
      <p className="text-muted-foreground mb-4">
        {message}
      </p>
    </div>
  );
};
