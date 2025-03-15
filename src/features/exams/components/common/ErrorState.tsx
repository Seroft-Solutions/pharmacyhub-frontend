"use client"

import React from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCcw } from 'lucide-react';

interface ErrorStateProps {
  error: unknown;
  onRetry: () => void;
}

/**
 * Component for displaying error state
 */
export const ErrorState: React.FC<ErrorStateProps> = ({ error, onRetry }) => {
  return (
    <div className="text-center text-red-500 p-4 border border-red-200 rounded-md">
      <p className="mb-4">{error instanceof Error ? error.message : 'Failed to load exams'}</p>
      <div className="flex justify-center space-x-4">
        <Button onClick={onRetry} className="flex items-center gap-2">
          <RefreshCcw className="h-4 w-4" />
          Retry
        </Button>
        <Button 
          variant="outline" 
          onClick={() => localStorage.removeItem('access_token')} 
          className="flex items-center gap-2"
        >
          Clear Token
        </Button>
      </div>
      <p className="mt-4 text-xs text-gray-500">
        Error details: 403 Forbidden. Make sure your backend is running and accessible.
      </p>
    </div>
  );
};
