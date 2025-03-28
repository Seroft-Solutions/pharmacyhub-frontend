'use client';

import React from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { SessionData } from '../types';
import { SessionItem } from './SessionItem';
import { AlertCircleIcon, InfoIcon } from 'lucide-react';

interface SessionListProps {
  sessions: SessionData[];
  isLoading?: boolean;
  error?: string;
  onTerminate?: (sessionId: string) => void;
  showControls?: boolean;
  emptyMessage?: string;
}

export const SessionList: React.FC<SessionListProps> = ({
  sessions,
  isLoading = false,
  error,
  onTerminate,
  showControls = true,
  emptyMessage = 'No active sessions found.',
}) => {
  // Handle loading state
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2].map((_, index) => (
          <div key={index} className="border rounded-lg p-4 animate-pulse">
            <div className="flex justify-between">
              <div className="h-4 bg-muted rounded w-1/3 mb-4"></div>
              <div className="h-4 bg-muted rounded w-16"></div>
            </div>
            <div className="space-y-2">
              <div className="h-3 bg-muted rounded w-2/3"></div>
              <div className="h-3 bg-muted rounded w-1/2"></div>
            </div>
            <div className="flex justify-end mt-4">
              <div className="h-6 bg-muted rounded w-24"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Handle error state
  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircleIcon className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  // Handle empty state
  if (!sessions || sessions.length === 0) {
    return (
      <Alert>
        <InfoIcon className="h-4 w-4" />
        <AlertTitle>No Sessions</AlertTitle>
        <AlertDescription>{emptyMessage}</AlertDescription>
      </Alert>
    );
  }

  // Render the list of sessions
  return (
    <div className="space-y-4">
      {sessions.map((session) => (
        <SessionItem
          key={session.id}
          session={session}
          onTerminate={onTerminate}
          showControls={showControls}
        />
      ))}
    </div>
  );
};
