import React from 'react';
import { Progress } from '@/components/ui/progress';
import { CheckCircleIcon, AlertCircleIcon, HelpCircleIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ExamProgressProps {
  currentQuestion: number;
  totalQuestions: number;
  answeredQuestions: number;
  flaggedQuestionsCount?: number;
  timePercentage?: number;
}

export function ExamProgress({
  currentQuestion,
  totalQuestions,
  answeredQuestions,
  flaggedQuestionsCount = 0,
  timePercentage = 100
}: ExamProgressProps) {
  const progressPercentage = (answeredQuestions / totalQuestions) * 100;
  
  // Calculate status colors
  const getTimeColor = () => {
    if (timePercentage > 50) return 'text-green-500';
    if (timePercentage > 25) return 'text-amber-500';
    return 'text-red-500';
  };
  
  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-1.5 text-sm font-medium">
          <span className="bg-primary/10 text-primary px-2 py-1 rounded">
            Question {currentQuestion + 1} of {totalQuestions}
          </span>
        </div>
        
        <div className="flex gap-3">
          <div className="flex items-center text-sm">
            <CheckCircleIcon className="h-4 w-4 text-green-500 mr-1.5" />
            <span className="font-medium">{answeredQuestions} Answered</span>
          </div>
          
          {flaggedQuestionsCount > 0 && (
            <div className="flex items-center text-sm">
              <AlertCircleIcon className="h-4 w-4 text-yellow-500 mr-1.5" />
              <span className="font-medium">{flaggedQuestionsCount} Flagged</span>
            </div>
          )}
          
          {answeredQuestions < totalQuestions && (
            <div className="flex items-center text-sm">
              <HelpCircleIcon className="h-4 w-4 text-gray-400 mr-1.5" />
              <span className="font-medium">{totalQuestions - answeredQuestions} Remaining</span>
            </div>
          )}
        </div>
      </div>
      
      <div className="space-y-1">
        <div className="flex justify-between text-xs text-gray-500">
          <span>Completion</span>
          <span>{Math.round(progressPercentage)}%</span>
        </div>
        <Progress 
          value={progressPercentage} 
          className="h-2" 
        />
      </div>
      
      {timePercentage < 100 && (
        <div className="space-y-1">
          <div className="flex justify-between text-xs">
            <span>Time Remaining</span>
            <span className={getTimeColor()}>{Math.round(timePercentage)}%</span>
          </div>
          <Progress 
            value={timePercentage} 
            className={cn(
              "h-1.5",
              timePercentage > 50 ? "bg-green-100" : timePercentage > 25 ? "bg-amber-100" : "bg-red-100"
            )}
          />
        </div>
      )}
    </div>
  );
}