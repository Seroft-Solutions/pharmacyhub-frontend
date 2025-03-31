// ExamHeader.tsx
"use client";

import React from 'react';
import { ExamTimer } from './ExamTimer';

interface ExamHeaderProps {
  title: string;
  description?: string;
  durationMinutes: number;
  onTimeUp: () => void;
}

export const ExamHeader: React.FC<ExamHeaderProps> = ({
  title,
  description,
  durationMinutes,
  onTimeUp,
}) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
      <div>
        <h1 className="text-2xl font-bold mb-1">{title}</h1>
        {description && (
          <p className="text-gray-600">{description}</p>
        )}
      </div>
      <div className="mt-4 md:mt-0 w-full md:w-auto">
        <ExamTimer
          duration={durationMinutes * 60}
          onTimeUp={onTimeUp}
        />
      </div>
    </div>
  );
};

export default ExamHeader;
