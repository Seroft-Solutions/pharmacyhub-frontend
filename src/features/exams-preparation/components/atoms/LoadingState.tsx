// LoadingState.tsx
"use client";

import React from 'react';
import { Loader2 } from 'lucide-react';
import { Spinner } from '@/components/ui/spinner';

interface LoadingStateProps {
  message?: string;
  className?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  message = 'Loading...',
  className = '',
}) => {
  return (
    <div className={`flex flex-col items-center justify-center p-8 text-center ${className}`}>
      <Spinner size="lg" />
      <p className="text-gray-500 mt-2">{message}</p>
    </div>
  );
};

export default LoadingState;
