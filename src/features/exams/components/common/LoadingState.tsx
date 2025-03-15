"use client"

import React from 'react';

/**
 * Component for displaying loading state
 */
export const LoadingState: React.FC = () => {
  return (
    <div className="space-y-4">
      <div className="animate-pulse flex flex-col space-y-4">
        <div className="h-8 bg-slate-200 rounded w-1/4"></div>
        <div className="space-y-2">
          <div className="h-4 bg-slate-200 rounded"></div>
          <div className="h-4 bg-slate-200 rounded"></div>
          <div className="h-4 bg-slate-200 rounded w-5/6"></div>
        </div>
      </div>
    </div>
  );
};
