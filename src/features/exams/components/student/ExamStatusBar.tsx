'use client';

import React, { FC } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';


interface ExamStatusBarProps {
  currentQuestion: number;
  totalQuestions: number;
  answeredQuestions: number;
  flaggedQuestionsCount: number;
  hideTimer?: boolean;
  totalTimeInSeconds?: number;
  timeRemainingInSeconds?: number;
}

/**
 * ExamStatusBar Component
 * 
 * Displays the exam progress, including current question, completion percentage,
 * and number of answered/flagged questions.
 */
export const ExamStatusBar: FC<ExamStatusBarProps> = ({
  currentQuestion,
  totalQuestions,
  answeredQuestions,
  flaggedQuestionsCount,
  hideTimer = false,
  totalTimeInSeconds,
  timeRemainingInSeconds,
}) => {
  // Calculate completion percentage
  const completionPercentage = Math.round((answeredQuestions / totalQuestions) * 100);
  
  // Calculate time percentage if time props are provided
  const timePercentage = totalTimeInSeconds && timeRemainingInSeconds !== undefined
    ? Math.round((timeRemainingInSeconds / totalTimeInSeconds) * 100)
    : null;
  
  return (
    <Card className="shadow-sm border border-gray-100 overflow-hidden">
      <CardContent className="pt-4">
        <div className="space-y-3">
          {/* Question progress */}
          <div className="flex justify-between items-center text-sm text-gray-600">
            <span>
              Question {currentQuestion + 1} of {totalQuestions}
            </span>
            <span>
              {completionPercentage}% Complete
            </span>
          </div>
          <Progress value={completionPercentage} className="h-2" />
          
          {/* Statistics */}
          <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
            <div>
              <span className="font-medium">Answered:</span>{' '}
              <span className="text-blue-600">{answeredQuestions}</span> of {totalQuestions}
            </div>
            <div>
              <span className="font-medium">Flagged:</span>{' '}
              <span className="text-amber-600">{flaggedQuestionsCount}</span> of {totalQuestions}
            </div>
          </div>
          
          {/* Timer progress if not hidden and time is provided */}
          {!hideTimer && timePercentage !== null && (
            <div className="mt-3">
              <div className="flex justify-between items-center text-sm text-gray-600">
                <span>Time Remaining</span>
                <span>
                  {Math.floor(timeRemainingInSeconds! / 60)}:{String(timeRemainingInSeconds! % 60).padStart(2, '0')}
                </span>
              </div>
              <Progress 
                value={timePercentage} 
                className="h-2" 
                indicatorColor={timePercentage < 25 ? 'bg-red-500' : 'bg-green-500'}
              />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ExamStatusBar;