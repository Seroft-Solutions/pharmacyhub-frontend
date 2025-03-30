// ExamLayout.tsx
"use client";

import React, { ReactNode } from 'react';
import { Card } from '@/features/core/ui/atoms/card';
import { LoadingState } from '../atoms/LoadingState';
import { ErrorState } from '../atoms/ErrorState';

interface ExamLayoutProps {
  children: ReactNode;
  title?: string;
  description?: string;
  isLoading?: boolean;
  error?: Error | null;
  onRetry?: () => void;
  header?: ReactNode;
  footer?: ReactNode;
  sidebar?: ReactNode;
  className?: string;
}

export const ExamLayout: React.FC<ExamLayoutProps> = ({
  children,
  title,
  description,
  isLoading = false,
  error = null,
  onRetry,
  header,
  footer,
  sidebar,
  className = '',
}) => {
  // Show loading state if loading
  if (isLoading) {
    return <LoadingState message="Loading exam..." />;
  }

  // Show error state if there's an error
  if (error) {
    return (
      <ErrorState
        message={error.message || 'An error occurred while loading the exam.'}
        onRetry={onRetry}
      />
    );
  }

  // Determine if sidebar is present for layout
  const hasSidebar = !!sidebar;

  return (
    <div className={`w-full max-w-7xl mx-auto ${className}`}>
      {/* Optional header */}
      {(title || description || header) && (
        <div className="mb-6">
          {header || (
            <>
              {title && <h1 className="text-2xl font-bold mb-2">{title}</h1>}
              {description && <p className="text-gray-600">{description}</p>}
            </>
          )}
        </div>
      )}

      {/* Main content with optional sidebar */}
      <div className={`grid ${hasSidebar ? 'grid-cols-1 md:grid-cols-4 gap-6' : ''}`}>
        {/* Sidebar (if provided) */}
        {hasSidebar && (
          <div className="md:col-span-1">
            <Card className="sticky top-4">{sidebar}</Card>
          </div>
        )}

        {/* Main content */}
        <div className={hasSidebar ? 'md:col-span-3' : 'w-full'}>
          {children}
        </div>
      </div>

      {/* Optional footer */}
      {footer && <div className="mt-6">{footer}</div>}
    </div>
  );
};

export default ExamLayout;
