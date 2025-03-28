"use client";

import React from 'react';

interface ApiDebuggerHeaderProps {
  expanded: boolean;
  baseUrl: string;
  onToggle: () => void;
}

/**
 * API Debugger Header Component
 * 
 * This component renders the header of the API Debugger with a toggle button
 * and basic API configuration information.
 */
const ApiDebuggerHeader: React.FC<ApiDebuggerHeaderProps> = ({
  expanded,
  baseUrl,
  onToggle
}) => {
  return (
    <div 
      className="px-4 py-3 bg-gray-50 border-b border-gray-200 flex justify-between items-center cursor-pointer"
      onClick={onToggle}
    >
      <h3 className="text-sm font-medium text-gray-700 flex items-center space-x-2">
        <span>🔌</span>
        <span>API Connectivity Debugger</span>
      </h3>
      <button
        className="text-gray-500 hover:text-gray-700 focus:outline-none"
        onClick={(e) => {
          e.stopPropagation();
          onToggle();
        }}
      >
        {expanded ? '▼' : '▲'}
      </button>
    </div>
  );
};

export default ApiDebuggerHeader;
