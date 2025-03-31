// ExamScoreOverview.tsx
"use client";

import React from 'react';
import { formatTimeVerbose } from '../../utils';

interface ExamScoreOverviewProps {
  score: number;
  totalScore: number;
  passingScore: number;
  timeSpent: number; // in seconds
}

export const ExamScoreOverview: React.FC<ExamScoreOverviewProps> = ({
  score,
  totalScore,
  passingScore,
  timeSpent,
}) => {
  return (
    <div className="bg-gray-50 p-6 rounded-lg">
      <h3 className="text-lg font-medium mb-4">Score Overview</h3>
      <div className="flex items-center justify-between mb-2">
        <span className="text-gray-600">Your Score:</span>
        <span className="font-medium">
          {score}/{totalScore} ({((score / totalScore) * 100).toFixed(1)}%)
        </span>
      </div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-gray-600">Passing Score:</span>
        <span className="font-medium">
          {passingScore}/{totalScore} ({((passingScore / totalScore) * 100).toFixed(1)}%)
        </span>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-gray-600">Time Spent:</span>
        <span className="font-medium">{formatTimeVerbose(timeSpent)}</span>
      </div>
    </div>
  );
};

export default ExamScoreOverview;
