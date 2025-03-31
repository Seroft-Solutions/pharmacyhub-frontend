// ExamStatistics.tsx
"use client";

import React from 'react';
import { CheckCircle, XCircle, HelpCircle } from 'lucide-react';

interface ExamStatisticsProps {
  correct: number;
  incorrect: number;
  unanswered: number;
  totalQuestions: number;
}

export const ExamStatistics: React.FC<ExamStatisticsProps> = ({
  correct,
  incorrect,
  unanswered,
  totalQuestions,
}) => {
  const getPercentage = (value: number) => {
    if (totalQuestions === 0) return 0;
    return ((value / totalQuestions) * 100).toFixed(1);
  };

  return (
    <div className="bg-gray-50 p-6 rounded-lg">
      <h3 className="text-lg font-medium mb-4">Question Statistics</h3>
      <div className="flex items-center justify-between mb-2">
        <span className="flex items-center text-gray-600">
          <CheckCircle className="h-4 w-4 mr-1 text-green-500" />
          Correct:
        </span>
        <span className="font-medium">
          {correct} ({getPercentage(correct)}%)
        </span>
      </div>
      <div className="flex items-center justify-between mb-2">
        <span className="flex items-center text-gray-600">
          <XCircle className="h-4 w-4 mr-1 text-red-500" />
          Incorrect:
        </span>
        <span className="font-medium">
          {incorrect} ({getPercentage(incorrect)}%)
        </span>
      </div>
      <div className="flex items-center justify-between">
        <span className="flex items-center text-gray-600">
          <HelpCircle className="h-4 w-4 mr-1 text-gray-500" />
          Unanswered:
        </span>
        <span className="font-medium">
          {unanswered} ({getPercentage(unanswered)}%)
        </span>
      </div>
    </div>
  );
};

export default ExamStatistics;
