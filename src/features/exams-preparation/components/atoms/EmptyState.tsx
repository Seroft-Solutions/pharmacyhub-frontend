// EmptyState.tsx
"use client";

import React from 'react';
import { FolderOpen } from 'lucide-react';

interface EmptyStateProps {
  message?: string;
  icon?: React.ReactNode;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  message = 'No items found',
  icon = <FolderOpen className="h-12 w-12 text-gray-400" />,
  className = '',
}) => {
  return (
    <div className={`flex flex-col items-center justify-center p-8 text-center ${className}`}>
      <div className="mb-4">{icon}</div>
      <p className="text-gray-500">{message}</p>
    </div>
  );
};

export default EmptyState;
